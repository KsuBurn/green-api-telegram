export const normalizeRecipient = (value: string): { phoneNumber: number } | { username: string } => {
    const input = value.trim();
    if (/^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(input)) {
        return { username: input };
    }
    if (!/^\+?[\d\s()-]+$/.test(input)) {
        throw new Error('Введите номер в международном формате или @username.');
    }
    const digits = input.replace(/\D/g, '');
    if (!/^[1-9]\d{6,14}$/.test(digits)) {
        throw new Error('Номер должен содержать от 7 до 15 цифр и код страны.');
    }
    return { phoneNumber: Number(digits) };
}

export const validateApiUrl = (value: string): string => {
    let url: URL;
    try {
        url = new URL(value);
    } catch {
        throw new Error('Введите корректный apiUrl из кабинета GREEN-API.');
    }
    // Credentials must never be sent to an arbitrary user-provided host.
    if (
        url.protocol !== 'https:' ||
        !/^(?:\d+\.api|api)\.green-api\.com$/.test(url.hostname) ||
        url.port ||
        url.username ||
        url.password ||
        url.search ||
        url.hash ||
        !/^\/?$/.test(url.pathname)
    ) {
        throw new Error(
            'apiUrl должен быть HTTPS-адресом API GREEN-API, например https://4100.api.green-api.com.',
        );
    }
    return url.origin;
}

export const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export const errorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : 'Не удалось выполнить запрос.';
}
