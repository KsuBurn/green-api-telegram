export class ApiError extends Error {
    public readonly status: number;

    constructor(message: string, status = 0) {
        super(message);

        this.name = 'ApiError';
        this.status = status;
    }

    get fatal() {
        return [400, 401, 403, 404].includes(this.status);
    }
}
