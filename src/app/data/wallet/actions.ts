import { savePassword, storeWallet } from './../../utils/wallet';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { Network } from 'moonlet-core/src/core/network';
import { getPassword, WALLET_STORAGE_KEY, restoreWallet, clearWallet } from '../../utils/wallet';
import { browser } from 'webextension-polyfill-ts';

// Action constants

export const CHANGE_NETWORK = 'CHANGE_NETWORK';
export const WALLET_LOADED = 'WALLET_LOADED';
export const WALLET_INVALID_PASSWORD = 'WALLET_INVALID_PASSWORD';
export const WALLET_SIGN_OUT = 'WALLET_SIGN_OUT';

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
    locked: boolean
) => {
    return {
        type: WALLET_LOADED,
        data: {
            loadingInProgress,
            loaded,
            locked
        }
    };
};

export const createLoadWallet = (pass?: string) => {
    return async dispatch => {
        const password = pass || (await getPassword());
        const storage = await browser.storage.local.get();

        if (storage[WALLET_STORAGE_KEY]) {
            if (password) {
                try {
                    await restoreWallet(storage[WALLET_STORAGE_KEY].json, password);
                    dispatch(createWalletLoaded(false, true, false));
                    savePassword(password);
                } catch (e) {
                    dispatch(createInvalidPassword());
                }
            } else {
                dispatch(createWalletLoaded(false, true, true));
            }
        } else {
            dispatch(createWalletLoaded(false, false, false));
        }

        await storeWallet(password);
    };
};

export const createInvalidPassword = () => {
    return {
        type: WALLET_INVALID_PASSWORD
    };
};

export const createSignOut = () => {
    return async dispatch => {
        dispatch({
            type: WALLET_SIGN_OUT
        });
        await clearWallet();
    };
};
