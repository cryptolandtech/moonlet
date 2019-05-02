import { Navigation } from './../../utils/navigation';
import { IRouteConfig } from '../../routes';
import { IAction } from '../action';
import { DeviceScreenSize } from './../../types';
import { route } from 'preact-router';

// Action constants

export const CHANGE_SCREEN_SIZE = 'CHANGE_SCREEN_SIZE';
export const CHANGE_PAGE = 'CHANGE_PAGE';

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
