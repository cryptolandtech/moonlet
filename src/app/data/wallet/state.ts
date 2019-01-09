import { BigNumber } from 'bignumber.js';
import { Blockchain } from 'moonlet-core/src/core/blockchain';

export type IWalletData = any;

export interface IAccountBalance {
    loading: boolean;
    amount: BigNumber;
}

export interface IWalletTransfer {
    inProgress: boolean;
    success: boolean;
    error: string;
    txn: string;
}

export interface IWalletState {
    invalidPassword: boolean;
    loadingInProgress: boolean;
    loaded: boolean;
    locked: boolean;
    selectedBlockchain: Blockchain;
    selectedNetwork: number;
    selectedAccount: number;
    data?: IWalletData;
    balances?: {
        [blockchain: string]: {
            [address: string]: IAccountBalance;
        };
    };
    transfer?: IWalletTransfer;
}
