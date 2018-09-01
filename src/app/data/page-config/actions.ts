import { DeviceScreenSize } from './../../types';
import { Action } from '../action';
import { IRouteConfig } from '../../routes';

// Action constants

export const CHANGE_SCREEN_SIZE = "CHANGE_SCREEN_SIZE";
export const CHANGE_PAGE = "CHANGE_PAGE";


// Action creators

export const createChangeScreenSize = (screenSize: DeviceScreenSize): Action => ({
    type: CHANGE_SCREEN_SIZE,
    data: {
        screenSize
    }
});

export const createChangePage = (routeConfig: IRouteConfig): Action => {
    return {
        type: CHANGE_PAGE,
        data: {
            routeConfig
        }
    }
}