import { compose, createStore, applyMiddleware } from 'redux';
import { IPageConfig } from './page-config/state';
import { reducers } from './reducers';
import reduxThunk from 'redux-thunk';

export interface IState {
    pageConfig: IPageConfig;
}

const defaultState: IState = {
    pageConfig: undefined
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
    applyMiddleware(loggerMiddleware, reduxThunk)
    // other store enhancers if any
);

export const getStore = (initialState: IState = defaultState) => {
    return createStore(reducers, initialState, enhancer);
};
