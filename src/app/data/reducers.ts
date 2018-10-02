import { combineReducers } from 'redux';
import pageConfig from './page-config/reducer';
import wallet from './wallet/reducer';

export const reducers = combineReducers({
    pageConfig,
    wallet
});
