import { IAction } from '../action';
import {
    DEV_MODE_TOGGLE,
    TESTNET_TOGGLE,
    NETWORK_SWITCH,
    SET_PREFERENCES,
    CHANGE_PREFERRED_CURRENCY,
    ACCEPT_DISCLAIMER
} from './actions';
import { IUserPreferences } from './state';

export default (state: IUserPreferences, action: IAction): IUserPreferences => {
    if (!state) {
        state = null;
    }
    if (!action.data) {
        action.data = {};
    }

    switch (action.type) {
        case SET_PREFERENCES:
            state = action.data;
            break;
        case DEV_MODE_TOGGLE:
            if (typeof action.data.value === 'boolean') {
                state = {
                    ...state,
                    devMode: action.data.value,
                    testNet: action.data.value ? state.testNet : false
                };
            } else {
                state = {
                    ...state,
                    devMode: !state.devMode,
                    testNet: !state.devMode ? state.testNet : false
                };
            }
            break;
        case TESTNET_TOGGLE:
            if (typeof action.data.value === 'boolean') {
                state = {
                    ...state,
                    testNet: action.data.value
                };
            } else {
                state = {
                    ...state,
                    testNet: !state.testNet
                };
            }
            break;
        case NETWORK_SWITCH:
            let networkOptions: any = {};
            if (!state.networks) {
                state.networks = {};
            }

            if (state.networks[action.data.blockchain]) {
                networkOptions = state.networks[action.data.blockchain];
            }

            if (action.data.mainNet) {
                networkOptions.mainNet = action.data.networkId;
            } else {
                networkOptions.testNet = action.data.networkId;
            }

            state = {
                ...state,
                networks: {
                    ...state.networks,
                    [action.data.blockchain]: networkOptions
                }
            };

            break;
        case CHANGE_PREFERRED_CURRENCY:
            state = {
                ...state,
                preferredCurrency: action.data.currency
            };
            break;
        case ACCEPT_DISCLAIMER:
            state = {
                ...state,
                disclaimerVersionAccepted: action.data.version
            };
            break;
    }

    return state;
};
