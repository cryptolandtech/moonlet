import { Blockchain } from 'moonlet-core/src/core/blockchain';

export interface IWalletState {
    selectedBlockchain: Blockchain;
    selectedNetwork: number;
    selectedAccount: number;
}
