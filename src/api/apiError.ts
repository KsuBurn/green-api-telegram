export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status = 0,
    ) {
        super(message);
        this.name = 'ApiError';
    }

    get fatal() {
        return [400, 401, 403, 404].includes(this.status);
    }
}
