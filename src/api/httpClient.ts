import { ApiError } from './apiError';

interface HttpClientOptions {
    baseUrl: string;
    headers?: HeadersInit;
    timeout?: number; // мс
    errorMessages?: Record<number, string>;
    networkErrorMessage?: string;
}

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    signal?: AbortSignal;
    headers?: HeadersInit;
    body?: unknown;
}

export class HttpClient {
    private readonly baseUrl: string;
    private readonly headers: Headers;
    private readonly timeout: number;
    private readonly errorMessages: Record<number, string>;
    private readonly networkErrorMessage: string;

    constructor({
        baseUrl,
        headers,
        timeout = 45000,
        errorMessages = {},
        networkErrorMessage = 'Нет ответа от сервера. Проверьте подключение к сети.',
    }: HttpClientOptions) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.headers = new Headers(headers);
        this.headers.set('Accept', 'application/json');
        this.timeout = timeout;
        this.errorMessages = errorMessages;
        this.networkErrorMessage = networkErrorMessage;
    }

    async request(path: string, options: RequestOptions = {}): Promise<unknown> {
        const { method = 'GET', signal, body } = options;
        const headers = new Headers(this.headers);
        new Headers(options.headers).forEach((value, name) => headers.set(name, value));
        if (body !== undefined) {
            headers.set('Content-Type', 'application/json');
        }

        const timeout = AbortSignal.timeout(this.timeout);
        const requestSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;

        try {
            const response = await fetch(`${this.baseUrl}/${path.replace(/^\//, '')}`, {
                method,
                headers,
                signal: requestSignal,
                body: body === undefined ? undefined : JSON.stringify(body),
                credentials: 'omit',
                referrerPolicy: 'no-referrer',
                cache: 'no-store',
            });

            if (!response.ok) {
                // Тело ошибки сервера может содержать учётные данные в URL запроса.
                throw new ApiError(
                    this.errorMessages[response.status] ??
                        `Ошибка сервера (${response.status}). Попробуйте позже.`,
                    response.status,
                );
            }

            const text = await response.text();
            if (!text.trim()) {
                return null;
            }

            try {
                return JSON.parse(text) as unknown;
            } catch {
                throw new ApiError('Сервер вернул некорректный JSON.');
            }
        } catch (error) {
            if (signal?.aborted) {
                throw new DOMException('Aborted', 'AbortError');
            }
            if (timeout.aborted) {
                throw new ApiError('Превышено время ожидания ответа сервера.');
            }
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(this.networkErrorMessage);
        }
    }
}
