import { isExtension } from './../../utils/platform-utils';
import { CHANGE_NETWORK, WALLET_LOADED, WALLET_INVALID_PASSWORD, WALLET_SIGN_OUT } from './actions';
import { IAction } from '../action';
import { IWalletState } from './state';

export default (state: IWalletState, action: IAction): IWalletState => {
    if (!state) {
        state = null;
    }

    switch (action.type) {
        case CHANGE_NETWORK:
            state = {
                ...state,
                selectedBlockchain: action.data.blockchain,
                selectedNetwork: action.data.network
            };
            break;
        case WALLET_LOADED:
            state = {
                ...state,
                invalidPassword: false,
                loadingInProgress: action.data.loadingInProgress,
                loaded: action.data.loaded,
                locked: action.data.locked
            };
            break;
        case WALLET_INVALID_PASSWORD:
            state = {
                ...state,
                invalidPassword: true
            };
            break;
        case WALLET_SIGN_OUT:
            state = {
                ...state,
                invalidPassword: false,
                loadingInProgress: false,
                loaded: isExtension(),
                locked: isExtension()
            };
            break;
    }

    return state;
};
