import { IRouteConfig } from './../../routes';
import { Action } from './../action';
import { DeviceScreenSize, Platform } from '../../types';
import { IRoute } from "../../routes";

export interface IDefaultTopBarConfig {
    left?: {
        /**
         * material icon name or "logo" to display the logo as icon
         */
        icon: string
        action?: Action
    },
    middle?: {
        type: "text" | "networkSelection",
        text?: string
    },
    right?: {
        type: "text" | "icon",
        icon?: string,
        action?: Action, 
        text?: string 
    }
}

export interface ILayout {
    topBar?: IDefaultTopBarConfig,
    bottomNav?: boolean,
    drawerMenu?: boolean
};

export interface IPageConfig {
    device: {
        platform: Platform,
        screenSize: DeviceScreenSize
    },

    routeConfig?: IRouteConfig,
    layout?: ILayout
}