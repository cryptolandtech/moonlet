import { Blockchain } from 'moonlet-core/src/core/blockchain';

export enum ConfirmationScreenErrorCodes {
    INVALID_ID = 'INVALID_ID',
    ACCESS_REJECTED_BY_USER = 'ACCESS_REJECTED_BY_USER'
}

export enum ConfirmationScreenType {
    ACCOUNT_ACCESS = 'ACCOUNT_ACCESS',
    TRANSACTION_CONFIRMATION = 'TRANSACTION_CONFIRMATION',
    SIGN_MESSAGE = 'SIGN_MESSAGE'
}

export interface IConfirmationScreenPlugin {
    openConfirmationScreen(screenType: ConfirmationScreenType, params: any);
    openAccountAccessScreen(blockchain: Blockchain, forceAccountSelection?: boolean);

    getConfirmationScreenParams(id: string): Promise<any>;

    setConfirmationScreenResult(id: string, result: any);
}
