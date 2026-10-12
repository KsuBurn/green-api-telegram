export interface Credentials {
    idInstance: string;
    apiTokenInstance: string;
    apiUrl: string;
}
export interface Message {
    id: string;
    chatId: string;
    text: string;
    timestamp: number;
    direction: 'incoming' | 'outgoing';
    status: 'sending' | 'queued' | 'failed';
}
export interface Chat {
    id: string;
    name: string;
    messages: Message[];
}
export interface Notification {
    receiptId: number;
    body: unknown;
}
export interface ChatApi {
    connect(signal: AbortSignal): Promise<void>;
    resolveRecipient(value: string, signal: AbortSignal): Promise<{ id: string; name: string }>;
    sendMessage(chatId: string, text: string, signal: AbortSignal): Promise<string>;
    receiveNotification(signal: AbortSignal): Promise<Notification | null>;
    deleteNotification(receiptId: number, signal: AbortSignal): Promise<void>;
}
