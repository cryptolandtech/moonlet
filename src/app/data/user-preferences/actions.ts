import { IAction } from '../action';

// Action constants

export const DEV_MODE_TOGGLE = 'DEV_MODE_TOGGLE';
export const TESTNET_TOGGLE = 'TESTNET_TOGGLE';

// Action creators

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
