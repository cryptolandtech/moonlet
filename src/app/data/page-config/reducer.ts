import { DeviceScreenSize, Platform } from './../../types';
import { IRoute, getRouteConfig, IRouteConfig } from './../../routes';
import { IPageConfig, ILayout } from "./state";
import { Action } from "../action";
import { CHANGE_PAGE, CHANGE_SCREEN_SIZE } from './actions';

const getLayout = (routeConfig: IRouteConfig, platform: Platform, screenSize: DeviceScreenSize): ILayout => {
    const config = getRouteConfig(routeConfig, platform, screenSize);
    return {
        topBar: config.topBar,
        bottomNav: config.bottomNav,
        drawerMenu: config.drawerMenu
    }
}

export default (state: IPageConfig, action: Action): IPageConfig => {
    if (!state) state = null;

    switch (action.type) {
        case CHANGE_PAGE:
            return {
                ...state,
                routeConfig: action.data.routeConfig,
                layout: getLayout(action.data.routeConfig, state.device.platform, state.device.screenSize)
            }
        case CHANGE_SCREEN_SIZE:
            return {
                ...state,
                device: {
                    ...state.device,
                    screenSize: action.data.screenSize
                },
                layout: getLayout(state.routeConfig, state.device.platform, action.data.screenSize)
            }
    }

    return state;
}
