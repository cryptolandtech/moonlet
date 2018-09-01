import { Platform, DeviceScreenSize } from './types';
import { IRoute } from './routes';
import { Component } from 'preact';
import { ILayout } from './data/page-config/state';

export type IRouteConfig = ILayout;

export interface IRoute {
    name: string,
    path: string,
    getComponent: {
        (): Promise<Component>
    },
    config: {
        [platform: string]: {
            [screenSize: string]: IRouteConfig
        }
    }
}

export const ROUTES: IRoute[] = [
    {
        name: "landingPage",
        path: "/",
        getComponent: () => Promise.resolve(require("./pages/landing/landing").LandingPage),
        config: {
            [Platform.ALL]: {
                [DeviceScreenSize.ALL]: {
                    topBar: {
                        left: {
                            icon: "logo"
                        }
                    }
                }
            }
        }
    },
    {
        name: "dashboard",
        path: "/dashboard",
        getComponent: () => Promise.resolve(require("./pages/dashboard/dashboard").DashboardPage),
        config: {}
    },
    {
        name: "createWallet",
        path: "/create-wallet",
        getComponent: () => Promise.resolve(require("./pages/create-wallet/create-wallet").CreateWalletPage),
        config: {}
    },
    {
        name: "importWallet",
        path: "/import-wallet",
        getComponent: () => Promise.resolve(require("./pages/import-wallet/import-wallet").ImportWalletPage),
        config: {}
    }
];

export const getRouteConfig = (routeConfig: IRouteConfig, platform: Platform, screenSize: DeviceScreenSize): IRouteConfig => {
    let result = {};

    if (routeConfig) {
        const paths = [
            [platform, screenSize],
            [platform, DeviceScreenSize.ALL],
            [Platform.ALL, screenSize],
            [Platform.ALL, DeviceScreenSize.ALL]
        ].reverse();

        let configs = [];
        for(let path of paths) {
            if (routeConfig[path[0]] && routeConfig[path[0]][path[1]]) {
                configs.push(routeConfig[path[0]][path[1]]);
            }
        }
        result = Object.assign({}, ...configs);
    }   

    return result;
}