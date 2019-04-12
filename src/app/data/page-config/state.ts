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
        text?: string | JSX.Element | (() => string | JSX.Element);
    };
    right?: {
        type: 'text' | 'icon' | 'menu';
        icon?: string;
        menuWidth?: number;
        action?: IAction | { () };
        text?: string | JSX.Element;
        items?: Array<{
            divider?: boolean;
            text?: string | JSX.Element;
            icon?: string;
            href?: string;
            target?: string;
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
