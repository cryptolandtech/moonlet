import { Blockchain } from 'moonlet-core/src/core/blockchain';

export interface IWalletState {
    invalidPassword: boolean;
    loadingInProgress: boolean;
    loaded: boolean;
    locked: boolean;
    selectedBlockchain: Blockchain;
    selectedNetwork: number;
    selectedAccount: number;
}
