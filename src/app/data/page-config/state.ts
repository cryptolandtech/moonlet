import { DeviceScreenSize, Platform } from '../../types';
import { IRouteConfig } from './../../routes';
import { IAction } from './../action';

export interface IDefaultTopBarConfig {
    left?: {
        /**
         * material icon name or "logo" to display the logo as icon
         */
        icon: string;
        action?: IAction | { () };
    };
    middle?: {
        type: 'text' | 'networkSelection';
        text?: string;
    };
    right?: {
        type: 'text' | 'icon';
        icon?: string;
        action?: IAction | { () };
        text?: string;
    };
}

export interface ILayout {
    topBar?: IDefaultTopBarConfig;
    bottomNav?: boolean;
    drawerMenu?: boolean;
}

export interface IDevice {
    platform: Platform;
    screenSize: DeviceScreenSize;
}

export interface IPageConfig {
    device: IDevice;
    routeConfig?: IRouteConfig;
    layout?: ILayout;
}
