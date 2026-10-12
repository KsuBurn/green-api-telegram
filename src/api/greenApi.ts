import { ApiError } from './apiError';
import { HttpClient } from './httpClient';
import type { ChatApi, Credentials, Notification } from '../types';
import { isRecord, normalizeRecipient, validateApiUrl } from '../utils/validation';

class GreenApi implements ChatApi {
    private session: { client: HttpClient; token: string } | null = null;

    configure(credentials: Credentials) {
        this.clearSession();
        const { idInstance, apiTokenInstance } = credentials;
        if (!/^\d+$/.test(idInstance) || !/^[a-zA-Z0-9_-]+$/.test(apiTokenInstance)) {
            throw new Error('Проверьте idInstance и apiTokenInstance.');
        }
        const client = new HttpClient({
            baseUrl: `${validateApiUrl(credentials.apiUrl)}/waInstance${idInstance}`,
            networkErrorMessage: 'Нет ответа от GREEN-API. Проверьте сеть и apiUrl.',
            errorMessages: {
                400: 'GREEN-API отклонил запрос. Проверьте настройки инстанса и пустой webhookUrl.',
                401: 'Неверные учётные данные GREEN-API.',
                403: 'Доступ запрещён. Проверьте токен и тариф инстанса.',
                404: 'Инстанс или метод не найден. Проверьте apiUrl и idInstance.',
                429: 'Превышен лимит запросов. Подождите и повторите попытку.',
                469: 'Telegram временно ограничил поиск получателей. Попробуйте позже.',
            },
        });
        this.session = { client, token: apiTokenInstance };
    }

    clearSession() {
        this.session = null;
    }

    private get client() {
        if (!this.session) {
            throw new ApiError('Сначала подключитесь к GREEN-API.');
        }
        return this.session.client;
    }

    private endpoint(method: string, suffix = '') {
        if (!this.session) {
            throw new ApiError('Сначала подключитесь к GREEN-API.');
        }
        return `${method}/${this.session.token}${suffix}`;
    }

    async connect(signal: AbortSignal) {
        const state = await this.client.request(this.endpoint('getStateInstance'), { signal });
        if (!isRecord(state) || state.stateInstance !== 'authorized') {
            throw new Error('Инстанс не авторизован. Подключите Telegram в кабинете GREEN-API.');
        }
        const settings = await this.client.request(this.endpoint('getSettings'), { signal });
        if (!isRecord(settings) || settings.incomingWebhook !== 'yes' || settings.webhookUrl) {
            throw new Error(
                'В кабинете включите incomingWebhook (входящие сообщения) и очистите webhookUrl. Изменения могут применяться около минуты.',
            );
        }
    }

    async resolveRecipient(value: string, signal: AbortSignal) {
        const result = await this.client.request(this.endpoint('checkAccount'), {
            method: 'POST',
            signal,
            body: normalizeRecipient(value),
        });
        if (isRecord(result) && result.status === false) {
            throw new Error('Поиск недоступен. Проверьте авторизацию и ограничения Telegram.');
        }
        if (
            !isRecord(result) ||
            result.exist !== true ||
            typeof result.chatId !== 'string' ||
            !result.chatId
        ) {
            throw new Error('Получатель не найден или его номер скрыт. Попробуйте @username.');
        }
        return {
            id: result.chatId,
            name:
                typeof result.username === 'string' && result.username
                    ? result.username
                    : value.trim(),
        };
    }

    async sendMessage(chatId: string, text: string, signal: AbortSignal) {
        const result = await this.client.request(this.endpoint('sendMessage'), {
            method: 'POST',
            signal,
            body: { chatId, message: text },
        });
        if (!isRecord(result) || typeof result.idMessage !== 'string' || !result.idMessage) {
            throw new ApiError(
                'GREEN-API не подтвердил отправку. Проверьте Telegram перед повтором.',
            );
        }
        return result.idMessage;
    }

    async receiveNotification(signal: AbortSignal): Promise<Notification | null> {
        const result = await this.client.request(
            this.endpoint('receiveNotification', '?receiveTimeout=30'),
            { signal },
        );
        if (result === null) {
            return null;
        }
        if (
            !isRecord(result) ||
            typeof result.receiptId !== 'number' ||
            !Number.isSafeInteger(result.receiptId) ||
            !('body' in result)
        ) {
            throw new ApiError('Некорректное уведомление GREEN-API.');
        }
        return { receiptId: result.receiptId, body: result.body };
    }

    async deleteNotification(receiptId: number, signal: AbortSignal) {
        const result = await this.client.request(
            this.endpoint('deleteNotification', `/${receiptId}`),
            {
                method: 'DELETE',
                signal,
            },
        );
        if (!isRecord(result) || result.result !== true) {
            throw new ApiError('Не удалось подтвердить уведомление. Получение будет повторено.');
        }
    }
}

export const greenApi = new GreenApi();
