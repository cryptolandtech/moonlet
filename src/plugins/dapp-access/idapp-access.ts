import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IResponseData } from '../../utils/response';

export enum DappAccessErrorCodes {
    INVALID_DAPP_URL = 'INVALID_DAPP_URL',
    UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS'
}

export interface IDappAccessPlugin {
    getAccount(dappUrl: string, blockchain: Blockchain, networkId: number): Promise<IResponseData>;
    grantAccountAccess(dappUrl: string, blockchain: Blockchain, networkId: number, address: string);
    revokeAccountAccess(dappUrl: string, blockchain?: Blockchain, networkId?: number);
    grantDappPermission(dappUrl: string): Promise<boolean>;
}
