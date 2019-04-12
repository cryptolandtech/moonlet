import { IUserPreferences, INetworksOptions } from './state';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IAction } from '../action';
import { IWalletProvider } from '../../iwallet-provider';
import { WALLET_CLEAR_BALANCES, createWalletSync } from '../wallet/actions';
import { getSwitchNetworkConfig } from '../../utils/blockchain/utils';
import { translate } from '../../utils/translate';

// Action constants

export const SET_PREFERENCES = 'SET_PREFERENCES';
export const DEV_MODE_TOGGLE = 'DEV_MODE_TOGGLE';
export const TESTNET_TOGGLE = 'TESTNET_TOGGLE';
export const NETWORK_SWITCH = 'NETWORK_SWITCH';
export const CHANGE_PREFERRED_CURRENCY = 'CHANGE_PREFERRED_CURRENCY';
export const ACCEPT_DISCLAIMER = 'ACCEPT_DISCLAIMER';
export const DISMISS_XSELL_DASHBOARD = 'DISMISS_XSELL_DASHBOARD';

// Action creators

export const createSetPreferences = (userPref: IUserPreferences): IAction => {
    return {
        type: SET_PREFERENCES,
        data: userPref
    };
};

export const createDevModeToggle = (
    walletProvider: IWalletProvider,
    devMode: boolean,
    testNet: boolean,
    networks: INetworksOptions
) => {
    return async dispatch => {
        await walletProvider.switchNetwork(
            getSwitchNetworkConfig(devMode ? testNet : false, networks)
        );
        dispatch({ type: WALLET_CLEAR_BALANCES });

        dispatch({
            type: DEV_MODE_TOGGLE,
            data: {
                value: devMode
            }
        });
    };
};

export const createTestNetToggle = (value?: boolean): IAction => {
    return {
        type: TESTNET_TOGGLE,
        data: {
            value
        }
    };
};

export const createSwitchNetwork = (
    walletProvider: IWalletProvider,
    blockchain: Blockchain,
    networkId: number,
    mainNet: boolean
) => {
    return async dispatch => {
        await walletProvider.switchNetwork({ [blockchain]: networkId });

        if (!mainNet) {
            const wallet = await walletProvider.getWallet();
            if (wallet.accounts) {
                const accounts = (wallet.accounts[blockchain] || []).filter(
                    acc => acc.node.network.network_id === networkId
                );
                if (accounts.length === 0) {
                    await walletProvider.createAccount(
                        blockchain,
                        `${translate('App.labels.account')} 1`
                    );
                }
            }
        }

        await createWalletSync(walletProvider)(dispatch);
        dispatch({ type: WALLET_CLEAR_BALANCES });
        dispatch({
            type: NETWORK_SWITCH,
            data: {
                blockchain,
                networkId,
                mainNet
            }
        });
    };
};

export const createChangePreferredCurrency = (currency: string): IAction => {
    return {
        type: CHANGE_PREFERRED_CURRENCY,
        data: {
            currency
        }
    };
};

export const createAcceptDisclaimer = (version: number): IAction => {
    return {
        type: ACCEPT_DISCLAIMER,
        data: {
            version
        }
    };
};

export const createDismissXSellDashboard = (): IAction => {
    return {
        type: DISMISS_XSELL_DASHBOARD
    };
};
