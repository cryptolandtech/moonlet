import { Action as ReduxAction } from 'redux';
import { Platform } from './../types';

export interface IAction<D = any, E = any> extends ReduxAction {
  data?: D;
  error?: E;
}
