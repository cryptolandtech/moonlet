import { DeviceScreenSize, Platform } from '../../types';
import { IRouteConfig } from './../../routes';
import { IAction } from './../action';

export interface IDefaultTopBarConfig {
    options?: {
        theme: 'default' | 'white';
    };
    left?: {
        /**
         * material icon name or "logo" to display the logo as icon
         */
        icon: string;
        action?: IAction | { () };
    };
    middle?: {
        type: 'text' | 'tokenPageTitle';
        text?: string | (() => string);
    };
    right?: {
        type: 'text' | 'icon' | 'menu';
        icon?: string;
        menuWidth?: number;
        action?: IAction | { () };
        text?: string;
        items?: Array<{
            text: string;
            icon?: string;
            href?: string;
            action?: IAction | { () };
        }>;
    };
    secondRow?: {
        type: 'total-balance';
    };
}

export interface ILayout {
    options?: {
        backgroundColor: 'white' | 'primary';
    };
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
