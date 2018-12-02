import { combineReducers } from 'redux';
import pageConfig from './page-config/reducer';
import wallet from './wallet/reducer';
import { IState } from './';

export const reducers = combineReducers<IState>({
    pageConfig,
    wallet,
    extension: state => state || {}
});
