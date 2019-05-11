import { Action as ReduxAction } from 'redux';

export interface IAction<D = any, E = any> extends ReduxAction {
    data?: D;
    error?: E;
}
