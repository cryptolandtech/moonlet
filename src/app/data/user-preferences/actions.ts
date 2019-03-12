import { IUserPreferences } from './state';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IAction } from '../action';

// Action constants

export const SET_PREFERENCES = 'SET_PREFERENCES';
export const DEV_MODE_TOGGLE = 'DEV_MODE_TOGGLE';
export const TESTNET_TOGGLE = 'TESTNET_TOGGLE';
export const NETWORK_SWITCH = 'NETWORK_SWITCH';

// Action creators

export const createSetPreferences = (userPref: IUserPreferences): IAction => {
    return {
        type: SET_PREFERENCES,
        data: userPref
    };
};

export const createDevModeToggle = (value?: boolean): IAction => {
    return {
        type: DEV_MODE_TOGGLE,
        data: {
            value
        }
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
    blockchain: Blockchain,
    networkId: number,
    mainNet: boolean
): IAction => {
    return {
        type: NETWORK_SWITCH,
        data: {
            blockchain,
            networkId,
            mainNet
        }
    };
};
