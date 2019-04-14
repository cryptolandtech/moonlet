import { IResponseData } from './../app/utils/response';
import { WalletEventType, WalletEventData } from 'moonlet-core/src/core/wallet-event-emitter';

export enum ConnectionPort {
    BACKGROUND = 'BACKGROUND',
    POPUP_DETECTION = 'POPUP_DETECTION'
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

export enum ExtensionMessageType {
    WALLET_EVENT = 'WALLET_EVENT',
    OLD_WALLET_DETECTED = 'OLD_WALLET_DETECTED'
}

export interface IExtensionMessage {
    type: ExtensionMessageType;
    data?: { data: WalletEventData; type: WalletEventType };
}
