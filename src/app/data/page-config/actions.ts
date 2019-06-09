import { Navigation } from './../../utils/navigation';
import { IRouteConfig } from '../../routes';
import { IAction } from '../action';
import { DeviceScreenSize } from './../../types';
import { IConfirmationScreen } from './state';

// Action constants

export const CHANGE_SCREEN_SIZE = 'CHANGE_SCREEN_SIZE';
export const CHANGE_PAGE = 'CHANGE_PAGE';
export const SET_CONFIRMATION_SCREEN_PARAMS = 'SET_CONFIRMATION_SCREEN_PARAMS';

// Action creators

export const createChangeScreenSize = (screenSize: DeviceScreenSize): IAction => ({
    type: CHANGE_SCREEN_SIZE,
    data: {
        screenSize
    }
});

export const createChangePage = (routeConfig: IRouteConfig): IAction => {
    return {
        type: CHANGE_PAGE,
        data: {
            routeConfig
        }
    };
};

export const goBack = (): IAction => {
    // history.back();
    Navigation.goBack();
    return undefined;
};

export const createSetConfirmationScreenParams = (screen: IConfirmationScreen) => {
    return {
        type: SET_CONFIRMATION_SCREEN_PARAMS,
        data: screen
    };
};
