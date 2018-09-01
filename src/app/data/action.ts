import { Platform } from './../types';
import {Action as ReduxAction} from "redux";

export interface Action<D = any, E = any> extends ReduxAction {
    data?: D,
    error?: E
}