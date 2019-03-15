import { IUserPreferences, INetworksOptions } from './state';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IAction } from '../action';
import { IWalletProvider } from '../../iwallet-provider';
import { WALLET_CLEAR_BALANCES } from '../wallet/actions';
import { getSwitchNetworkConfig } from '../../utils/blockchain/utils';

// Action constants

export const SET_PREFERENCES = 'SET_PREFERENCES';
export const DEV_MODE_TOGGLE = 'DEV_MODE_TOGGLE';
export const TESTNET_TOGGLE = 'TESTNET_TOGGLE';
export const NETWORK_SWITCH = 'NETWORK_SWITCH';
export const CHANGE_PREFERRED_CURRENCY = 'CHANGE_PREFERRED_CURRENCY';

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
