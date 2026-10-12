import { greenApi } from '../api/greenApi.ts';
import { useEffect, useReducer, useRef, useState } from 'react';
import { errorMessage } from '../utils/validation.ts';
import { pollNotifications } from '../utils/poll.ts';
import { parseIncoming } from '../utils/notifications.ts';
import { chatReducer } from '../utils/chatReducer.ts';

export const useChat = () => {
    const [chats, dispatch] = useReducer(chatReducer, []);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [pollError, setPollError] = useState<string | null>(null);
    const [stopped, setStopped] = useState(false);
    const [pollVersion, setPollVersion] = useState(0);
    const [sendError, setSendError] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const sendLock = useRef(false);
    const sessionController = useRef(new AbortController());

    useEffect(() => {
        const controller = new AbortController();
        sessionController.current = controller;
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        void pollNotifications(
            greenApi,
            controller.signal,
            (notification) => {
                const incoming = parseIncoming(notification.body);
                if (incoming) {
                    dispatch({ type: 'message', ...incoming });
                }
            },
            (error, isStopped = false) => {
                setPollError(error);
                setStopped(isStopped);
            },
        );
        return () => controller.abort();
    }, [pollVersion]);

    const createChat = async (value: string) => {
        const controller = sessionController.current;
        const chat = await greenApi.resolveRecipient(value, controller.signal);
        if (controller.signal.aborted) {
            return;
        }
        dispatch({ type: 'chat', ...chat });
        setActiveId(chat.id);
    }

    const send = async (text: string): Promise<boolean> => {
        if (!activeId || sendLock.current || !text.trim() || text.length > 4096) {
            return false;
        }
        sendLock.current = true;
        setSending(true);
        setSendError(null);
        const chatId = activeId;
        const localId = crypto.randomUUID();
        const controller = sessionController.current;
        dispatch({
            type: 'message',
            message: {
                id: localId,
                chatId,
                text,
                timestamp: Date.now(),
                direction: 'outgoing',
                status: 'sending',
            },
        });
        try {
            const id = await greenApi.sendMessage(chatId, text, controller.signal);
            if (controller.signal.aborted) {
                return false;
            }
            dispatch({ type: 'status', chatId, localId, status: 'queued', id });
            return true;
        } catch (error) {
            if (!controller.signal.aborted) {
                dispatch({ type: 'status', chatId, localId, status: 'failed' });
                setSendError(
                    `${errorMessage(error)} При обрыве связи сообщение могло уйти: проверьте Telegram перед повторной отправкой.`,
                );
            }
            return false;
        } finally {
            sendLock.current = false;
            if (!controller.signal.aborted) {
                setSending(false);
            }
        }
    }
    return {
        chats,
        activeId,
        setActiveId,
        createChat,
        send,
        sending,
        sendError,
        pollError,
        stopped,
        restartPolling: () => setPollVersion((value) => value + 1),
    };
}
