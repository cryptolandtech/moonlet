import { IUserPreferences } from './user-preferences/state';
import { compose, createStore, applyMiddleware, Store } from 'redux';
import { IPageConfig } from './page-config/state';
import { reducers } from './reducers';
import reduxThunk from 'redux-thunk';
import { IWalletState } from './wallet/state';

export interface IState {
    pageConfig: IPageConfig;
    wallet: IWalletState;
    extension?: {
        version: string;
    };
    userPreferences: IUserPreferences;
}

const defaultState: IState = {
    pageConfig: undefined,
    wallet: undefined,
    extension: undefined,
    userPreferences: {
        devMode: false,
        testNet: false
    }
};

const composeEnhancers =
    typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
              // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
          })
        : compose;

const loggerMiddleware = store => next => action => {
    /* tslint:disable:no-console */
    console.log('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    /* tslint:enable:no-console */
    return result;
};

const enhancer = composeEnhancers(
    applyMiddleware(/*loggerMiddleware, */ reduxThunk)
    // other store enhancers if any
);

export const getStore = (initialState: IState = defaultState): Store<IState> => {
    return createStore<IState, any, any, any>(reducers, initialState, enhancer);
};
