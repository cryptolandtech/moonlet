import { isExtension } from './../../utils/platform-utils';
import {
    WALLET_LOADED,
    WALLET_INVALID_PASSWORD,
    WALLET_SIGN_OUT,
    WALLET_UPDATE_BALANCE,
    WALLET_TRANSFER,
    WALLET_CLEAR_BALANCES,
    WALLET_SYNC,
    WALLET_OLD_ACCOUNT_WARNING
} from './actions';
import { IAction } from '../action';
import { IWalletState, WalletStatus } from './state';

export default (state: IWalletState, action: IAction): IWalletState => {
    if (!state) {
        state = null;
    }

    switch (action.type) {
        case WALLET_LOADED:
            state = {
                ...state,
                invalidPassword: false,
                status: action.data.status,
                data: action.data.wallet
            };
            break;
        case WALLET_SYNC:
            state = {
                ...state,
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
                status: WalletStatus.LOCKED // isExtension() ? WalletStatus.LOCKED : WalletStatus.UNAVAILABLE
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
                        ...balances[action.data.blockchain],
                        [action.data.address]: {
                            ...accountBalance,
                            loading: action.data.loading,
                            amount: action.data.amount || accountBalance.amount,
                            lastUpdate: Date.now()
                        }
                    }
                }
            };

            if (!action.data.loading) {
                state.balances[action.data.blockchain][action.data.address].lastUpdate = Date.now();
            }
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
        case WALLET_CLEAR_BALANCES:
            state = {
                ...state,
                balances: {}
            };
            break;
        case WALLET_OLD_ACCOUNT_WARNING:
            state = {
                ...state,
                oldAccountWarning: action.data.show
            };
            break;
    }

    return state;
};
