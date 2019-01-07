import { GenericAccount } from 'moonlet-core/src/core/account';

export class Response {
    public static resolve(data?) {
        return {
            error: false,
            data
        };
    }

    public static reject(code, message?, data?) {
        return {
            error: true,
            code,
            message,
            data
        };
    }
}
