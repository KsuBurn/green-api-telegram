import { type FC, useEffect, useRef, useState } from 'react';
import styles from './Conversation.module.css';
import type { Chat, Message } from '../../types.ts';
import type { TextAreaRef } from 'antd/es/input/TextArea';
import { Button, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import type { FormEvent, KeyboardEvent } from 'react';


interface ConversationProps {
    chat: Chat;
    sending: boolean;
    onSend: (text: string) => Promise<boolean>;
}

const messageStatus: Record<Message['status'], string> = {
    sending: 'Отправка…',
    failed: 'Не подтверждено',
    queued: 'В очереди ✓',
};

export const Conversation: FC<ConversationProps> = ({ chat, sending, onSend }) => {
    const [draft, setDraft] = useState('');
    const listRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<TextAreaRef>(null);
    const shouldScrollRef = useRef(true);

    useEffect(() => {
        const list = listRef.current;

        if (list && shouldScrollRef.current) {
            list.scrollTop = list.scrollHeight;
        }
    }, [chat.messages]);

    const handleScroll = () => {
        const list = listRef.current;

        if (list) {
            shouldScrollRef.current = list.scrollHeight - list.scrollTop - list.clientHeight < 100;
        }
    }

    const sendMessage = async () => {
        if (!draft.trim() || draft.length > 4096 || sending) {
            return;
        }

        const success = await onSend(draft);

        if (success) {
            setDraft('');
        }

        textareaRef.current?.focus();
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void sendMessage();
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            void sendMessage();
        }
    }

    return (
        <>
            <div
                ref={listRef}
                className={styles.messageList}
                role="log"
                aria-label="Сообщения"
                aria-live="polite"
                onScroll={handleScroll}
            >
                <p className={styles.historyNote}>Сообщения текущей сессии</p>

                {chat.messages.length === 0 && (
                    <div className={styles.emptyThread}>
                        <p>Начните разговор</p>
                        <span>Напишите первое сообщение ниже</span>
                    </div>
                )}

                {chat.messages.map((message) => (
                    <article
                        key={message.id}
                        className={`${styles.bubble} ${message.direction === 'outgoing' ? styles.outgoing : ''}`}
                    >
                        <p>{message.text}</p>
                        <footer>
                            <time dateTime={new Date(message.timestamp).toISOString()}>
                                {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </time>
                            {message.direction === 'outgoing' && (
                                <span
                                    className={
                                        message.status === 'failed'
                                            ? styles.failedStatus
                                            : undefined
                                    }
                                >
                                    {messageStatus[message.status]}
                                </span>
                            )}
                        </footer>
                    </article>
                ))}
            </div>

            <form className={styles.composer} onSubmit={handleSubmit}>
                <div className={styles.draftWrap}>
                    <Input.TextArea
                        ref={textareaRef}
                        aria-label="Текст сообщения"
                        placeholder="Напишите сообщение…"
                        value={draft}
                        disabled={sending}
                        maxLength={4096}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        variant="borderless"
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <span className={styles.draftHint}>
                        Enter — отправить · Shift + Enter — новая строка
                        <span>{draft.length}/4096</span>
                    </span>
                </div>
                <Button
                    type="primary"
                    htmlType="submit"
                    shape="circle"
                    loading={sending}
                    icon={<SendOutlined />}
                    className={styles.sendButton}
                    title="Отправить сообщение"
                    aria-label="Отправить сообщение"
                    disabled={!draft.trim() || sending}
                />
            </form>
        </>
    );
};
