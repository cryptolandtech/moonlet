import { IAction } from '../action';
import { DEV_MODE_TOGGLE, TESTNET_TOGGLE } from './actions';
import { IUserPreferences } from './state';

export default (state: IUserPreferences, action: IAction): IUserPreferences => {
    if (!state) {
        state = null;
    }
    if (!action.data) {
        action.data = {};
    }

    switch (action.type) {
        case DEV_MODE_TOGGLE:
            if (typeof action.data.value === 'boolean') {
                state = {
                    ...state,
                    devMode: action.data.value
                };
            } else {
                state = {
                    ...state,
                    devMode: !state.devMode
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
    }

    return state;
};
