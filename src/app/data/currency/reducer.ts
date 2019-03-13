import { LOAD_CONVERSION_RATES } from './actions';
import { ICurrency } from './state';
import { IAction } from '../action';

export default (state: ICurrency, action: IAction): ICurrency => {
    if (!state) {
        state = null;
    }
    if (!action.data) {
        action.data = {};
    }

    switch (action.type) {
        case LOAD_CONVERSION_RATES:
            for (const token of Object.keys(action.data)) {
                state = {
                    ...state,
                    [token]: {
                        ...action.data[token],
                        lastUpdate: Date.now()
                    }
                };
            }
            break;
    }

    return state;
};
