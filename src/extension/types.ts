import { IResponseData } from './../app/utils/response';

export enum ConnectionPort {
    BACKGROUND = 'BACKGROUND'
}

export enum BackgroundMessageController {
    WALLET_MANAGER = 'WALLET_MANGER',
    REMOTE_INTERFACE = 'REMOTE_INTERFACE'
}

export enum BackgroundMessageType {
    REQUEST = 'REQUEST',
    RESPONSE = 'RESPONSE'
}

export interface IBackgroundMessage {
    id: string;
    type: BackgroundMessageType;
    request: {
        controller: BackgroundMessageController;
        action: string;
        params?: any[];
    };
    response?: IResponseData;
}
