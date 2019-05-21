import { UPDATE_APP } from './actions';
import { IAppState } from './state';
import { IAction } from '../action';

export default (state: IAppState, action: IAction<IAppState>): IAppState => {
    if (!state) {
        state = null;
    }

    switch (action.type) {
        case UPDATE_APP:
            state = {
                ...state,
                ...action.data
            };
            break;
    }

    return state;
};
