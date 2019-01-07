import { FeeOptions } from './../../utils/blockchain/types';
import { BigNumber } from 'bignumber.js';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { Network } from 'moonlet-core/src/core/network';
import { IWalletData } from './state';
import { IWalletProvider, WalletErrorCodes } from '../../iwallet-provider';
import { IAction } from '../action';

// Action constants

export const CHANGE_NETWORK = 'CHANGE_NETWORK';
export const WALLET_LOADED = 'WALLET_LOADED';
export const WALLET_INVALID_PASSWORD = 'WALLET_INVALID_PASSWORD';
export const WALLET_SIGN_OUT = 'WALLET_SIGN_OUT';
export const WALLET_UPDATE_BALANCE = 'WALLET_UPDATE_BALANCE';
export const WALLET_TRANSFER = 'WALLET_TRANSFER';

// Action creators
export const createChangeNetwork = (blockchain: Blockchain, network: Network) => {
    return {
        type: CHANGE_NETWORK,
        data: {
            blockchain,
            network
        }
    };
};

export const createWalletLoaded = (
    loadingInProgress: boolean,
    loaded: boolean,
    locked: boolean,
    wallet?: IWalletData
) => {
    return {
        type: WALLET_LOADED,
        data: {
            loadingInProgress,
            loaded,
            locked,
            wallet
        }
    };
};

export const createWallet = (
    walletProvider: IWalletProvider,
    mnemonics: string,
    password: string
) => {
    return async dispatch => {
        try {
            const wallet = await walletProvider.createWallet(mnemonics, password);
            dispatch(createWalletLoaded(false, true, false, wallet));
        } catch (e) {
            // TODO: handle exceptions
            // console.log(e);
        }
    };
};

export const createLoadWallet = (walletProvider: IWalletProvider, pass?: string) => {
    return async dispatch => {
        try {
            const wallet = pass
                ? await walletProvider.unlockWallet(pass)
                : await walletProvider.getWallet();

            dispatch(createWalletLoaded(false, true, false, wallet));
        } catch (e) {
            switch (e.code) {
                case WalletErrorCodes.WALLET_LOCKED:
                    dispatch(createWalletLoaded(false, true, true));
                    break;
                case WalletErrorCodes.INVALID_PASSWORD:
                    dispatch({
                        type: WALLET_INVALID_PASSWORD
                    });
                    break;
                default:
                    dispatch(createWalletLoaded(false, false, false));
                    break;
            }
        }
    };
};

export const createSignOut = (walletProvider: IWalletProvider) => {
    return async dispatch => {
        await walletProvider.lockWallet();
        dispatch({
            type: WALLET_SIGN_OUT
        });
    };
};

export const createGetBalance = (
    walletProvider: IWalletProvider,
    blockchain: Blockchain,
    address: string
) => {
    return async dispatch => {
        try {
            dispatch({
                type: WALLET_UPDATE_BALANCE,
                data: {
                    blockchain,
                    address,
                    loading: true
                }
            });
            const balance: BigNumber = await walletProvider.getBalance(blockchain, address);
            dispatch({
                type: WALLET_UPDATE_BALANCE,
                data: {
                    blockchain,
                    address,
                    loading: false,
                    amount: balance
                }
            });
        } catch (e) {
            // console.log("error", e);
            // TODO error handling -> maybe show an error message on UI
        }
    };
};

export const createTransfer = (
    walletProvider: IWalletProvider,
    blockchain: Blockchain,
    fromAddress: string,
    toAddress: string,
    amount: BigNumber,
    feeOptions: FeeOptions
) => {
    return async dispatch => {
        try {
            dispatch({
                type: WALLET_TRANSFER,
                data: {
                    inProgress: true,
                    success: undefined,
                    error: undefined
                }
            });
            await walletProvider.transfer(blockchain, fromAddress, toAddress, amount, feeOptions);
            createLoadWallet(walletProvider)(dispatch);
            dispatch({
                type: WALLET_TRANSFER,
                data: {
                    inProgress: false,
                    success: true
                }
            });
        } catch (e) {
            // console.log("transfer error", e);
            dispatch({
                type: WALLET_TRANSFER,
                data: {
                    inProgress: false,
                    success: false,
                    error: e.message || e.code || 'Error while doing the transfer.'
                }
            });
        }
    };
};
