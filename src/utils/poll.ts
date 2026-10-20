import type { ChatApi, Notification } from '../types';
import { ApiError } from '../api/apiError';

export const delay = (ms: number, signal: AbortSignal): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (signal.aborted) {
            reject(new DOMException('Aborted', 'AbortError'));
            return;
        }
        const onAbort = () => {
            clearTimeout(timer);
            reject(new DOMException('Aborted', 'AbortError'));
        };
        const timer = setTimeout(() => {
            signal.removeEventListener('abort', onAbort);
            resolve();
        }, ms);
        signal.addEventListener('abort', onAbort, { once: true });
    });
};

export const pollNotifications = async (
    api: ChatApi,
    signal: AbortSignal,
    onNotification: (notification: Notification) => void,
    onStatus: (error: string | null, stopped?: boolean) => void,
) => {
    while (!signal.aborted) {
        try {
            const notification = await api.receiveNotification(signal);
            if (signal.aborted) {
                return;
            }
            if (notification) {
                onNotification(notification);
                await api.deleteNotification(notification.receiptId, signal);
            }
            onStatus(null);
        } catch (error) {
            if (signal.aborted) {
                return;
            }
            const fatal = error instanceof ApiError && error.fatal;
            onStatus(error instanceof Error ? error.message : 'Ошибка получения сообщений.', fatal);
            if (fatal) {
                return;
            }
            try {
                await delay(3000, signal);
            } catch {
                return;
            }
        }
    }
};
