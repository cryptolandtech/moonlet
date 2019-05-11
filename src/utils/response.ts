export interface IResponseData<D = any> {
    error: boolean;
    data?: D;
    code?: string;
    message?: string;
}

export class Response {
    public static resolve(data?): IResponseData {
        return {
            error: false,
            data
        };
    }

    public static reject(code, message?, data?): IResponseData {
        return {
            error: true,
            code,
            message,
            data
        };
    }
}
