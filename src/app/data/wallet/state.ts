import { BigNumber } from 'bignumber.js';

export type IWalletData = any;

export enum WalletStatus {
    UNAVAILABLE = 'UNAVAILABLE',
    LOADING = 'LOADING',
    LOCKED = 'LOCKED',
    UNLOCKED = 'UNLOCKED'
}

export interface IAccountBalance {
    loading: boolean;
    amount: BigNumber;
    lastUpdate: number;
}

export interface IWalletTransfer {
    inProgress: boolean;
    success: boolean;
    error: string;
    txn: string;
}

export interface IAccountsBalances {
    [blockchain: string]: {
        [address: string]: IAccountBalance;
    };
}

export interface IWalletState {
    invalidPassword: boolean;
    oldAccountWarning?: boolean;
    status: WalletStatus;
    data?: IWalletData;
    balances?: IAccountsBalances;
    transfer?: IWalletTransfer;
}
