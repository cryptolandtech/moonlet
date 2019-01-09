import { isExtension } from './../../utils/platform-utils';
import {
    CHANGE_NETWORK,
    WALLET_LOADED,
    WALLET_INVALID_PASSWORD,
    WALLET_SIGN_OUT,
    WALLET_UPDATE_BALANCE,
    WALLET_TRANSFER
} from './actions';
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
                locked: action.data.locked,
                data: action.data.wallet
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
        case WALLET_UPDATE_BALANCE:
            const balances = state.balances || {};
            const accountsBalances = balances[action.data.blockchain] || {};
            const accountBalance = accountsBalances[action.data.address] || { amount: '' };

            state = {
                ...state,
                balances: {
                    ...balances,
                    [action.data.blockchain]: {
                        [action.data.address]: {
                            loading: action.data.loading,
                            amount: action.data.amount || accountBalance.amount
                        }
                    }
                }
            };
            break;
        case WALLET_TRANSFER:
            state = {
                ...state,
                transfer: {
                    inProgress: action.data.inProgress,
                    success: action.data.success,
                    error: action.data.error,
                    txn: action.data.txn
                }
            };
            break;
    }

    return state;
};
