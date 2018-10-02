import { CHANGE_NETWORK } from './actions';
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
    }

    return state;
};
