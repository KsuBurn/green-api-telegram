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
}

export const pollNotifications = async (
    api: ChatApi,
    signal: AbortSignal,
    onNotification: (notification: Notification) => void,
    onStatus: (error: string | null, stopped?: boolean) => void,
) => {
    let failures = 0;
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
            failures = 0;
            onStatus(null);
            // Also guards against an upstream server returning immediate empty responses.
            await delay(350, signal);
        } catch (error) {
            if (signal.aborted) {
                return;
            }
            const fatal = error instanceof ApiError && error.fatal;
            onStatus(error instanceof Error ? error.message : 'Ошибка получения сообщений.', fatal);
            if (fatal) {
                return;
            }
            failures++;
            try {
                await delay(Math.min(1000 * 2 ** Math.min(failures, 5), 30_000), signal);
            } catch {
                return;
            }
        }
    }
}
