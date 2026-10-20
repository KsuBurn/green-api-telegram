import type { Message } from '../types';
import { isRecord } from './validation';

export const parseIncoming = (body: unknown): { message: Message; name: string } | null => {
    if (
        !isRecord(body) ||
        body.typeWebhook !== 'incomingMessageReceived' ||
        typeof body.idMessage !== 'string' ||
        typeof body.timestamp !== 'number' ||
        !Number.isFinite(body.timestamp) ||
        !isRecord(body.senderData) ||
        !isRecord(body.messageData)
    ) {
        return null;
    }
    const { senderData, messageData } = body;
    if (typeof senderData.chatId !== 'string') {
        return null;
    }
    let text: unknown;
    if (messageData.typeMessage === 'textMessage' && isRecord(messageData.textMessageData)) {
        text = messageData.textMessageData.textMessage;
    } else if (
        messageData.typeMessage === 'extendedTextMessage' &&
        isRecord(messageData.extendedTextMessageData)
    ) {
        text = messageData.extendedTextMessageData.text;
    }
    if (typeof text !== 'string') {
        return null;
    }
    const name =
        typeof senderData.chatName === 'string' && senderData.chatName
            ? senderData.chatName
            : senderData.chatId;
    return {
        name,
        message: {
            id: body.idMessage,
            chatId: senderData.chatId,
            timestamp: body.timestamp * 1000,
            text,
            direction: 'incoming',
            status: 'queued',
        },
    };
};
