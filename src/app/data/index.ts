import { createStore, compose } from 'redux';
import { reducers } from "./reducers";
import { IPageConfig } from './page-config/state';

export interface IState {
    pageConfig: IPageConfig
}

const defaultState: IState = {
    pageConfig: undefined
}

const composeEnhancers =
  typeof window === 'object' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  //applyMiddleware(...middleware),
  // other store enhancers if any
);

export const getStore = (initialState: IState = defaultState) => {
    return createStore(reducers, initialState, enhancer);
}