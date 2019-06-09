import { IAction } from '../action';
import { getRouteConfig, IRouteConfig } from './../../routes';
import { DeviceScreenSize, Platform } from './../../types';
import { CHANGE_PAGE, CHANGE_SCREEN_SIZE, SET_CONFIRMATION_SCREEN_PARAMS } from './actions';
import { ILayout, IPageConfig } from './state';

const getLayout = (
    routeConfig: IRouteConfig,
    platform: Platform,
    screenSize: DeviceScreenSize
): ILayout => {
    const config = getRouteConfig(routeConfig, platform, screenSize);
    return config;
};

export default (state: IPageConfig, action: IAction): IPageConfig => {
    if (!state) {
        state = null;
    }

    switch (action.type) {
        case CHANGE_PAGE:
            return {
                ...state,
                routeConfig: action.data.routeConfig,
                layout: getLayout(
                    action.data.routeConfig,
                    state.device.platform,
                    state.device.screenSize
                )
            };
        case CHANGE_SCREEN_SIZE:
            return {
                ...state,
                device: {
                    ...state.device,
                    screenSize: action.data.screenSize
                },
                layout: getLayout(state.routeConfig, state.device.platform, action.data.screenSize)
            };
        case SET_CONFIRMATION_SCREEN_PARAMS:
            return {
                ...state,
                confirmationScreen: action.data
            };
    }

    return state;
};
