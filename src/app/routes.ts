import { browser } from 'webextension-polyfill-ts';
import { goBack } from './data/page-config/actions';
import { Component } from 'preact';
import { ILayout } from './data/page-config/state';
import { IRoute } from './routes';
import { DeviceScreenSize, Platform } from './types';
import { mergeDeep } from './utils/merge-deep';

export type IRouteConfig = ILayout;

export interface IRoute {
    name: string;
    path: string;
    getComponent: () => Promise<Component>;
    withoutWalletInstance?: boolean;
    config: {
        [platform: string]: {
            [screenSize: string]: IRouteConfig;
        };
    };
}

export const ROUTES: IRoute[] = [
    {
        name: 'landingPage',
        path: '/',
        getComponent: () => Promise.resolve(require('./pages/landing/landing.container').default),
        withoutWalletInstance: true,
        config: {
            [Platform.ALL]: {
                [DeviceScreenSize.ALL]: {
                    topBar: {
                        left: {
                            icon: 'logo'
                        }
                    }
                }
            }
        }
    },
    {
        name: 'dashboard',
        path: '/dashboard',
        getComponent: () =>
            Promise.resolve(require('./pages/dashboard/dashboard.container').default),
        config: {
            [Platform.ALL]: {
                [DeviceScreenSize.SMALL]: {
                    topBar: {
                        left: {
                            icon: 'logo'
                        },
                        middle: {
                            type: 'networkSelection'
                        }
                    },
                    bottomNav: true
                },
                [DeviceScreenSize.BIG]: {
                    drawerMenu: true
                }
            },
            [Platform.EXTENSION]: {
                [DeviceScreenSize.SMALL]: {
                    topBar: {
                        right: {
                            type: 'icon',
                            icon: 'launch',
                            action: () => {
                                browser.tabs.create({
                                    url: document.location.href.replace('popup=1', '')
                                });
                            }
                        }
                    }
                }
            }
        }
    },
    {
        name: 'createWallet',
        path: '/create-wallet',
        getComponent: () =>
            Promise.resolve(require('./pages/create-wallet/create-wallet.container').default),
        withoutWalletInstance: true,
        config: {
            [Platform.ALL]: {
                [DeviceScreenSize.ALL]: {
                    topBar: {
                        left: {
                            icon: 'close',
                            action: goBack
                        },
                        middle: {
                            type: 'text',
                            text: 'Create New Wallet'
                        },
                        right: {
                            type: 'text',
                            text: '1/3'
                        }
                    }
                }
            }
        }
    },
    {
        name: 'importWallet',
        path: '/import-wallet',
        getComponent: () =>
            Promise.resolve(require('./pages/import-wallet/import-wallet.container').default),
        withoutWalletInstance: true,
        config: {
            [Platform.ALL]: {
                [DeviceScreenSize.ALL]: {
                    topBar: {
                        left: {
                            icon: 'close',
                            action: goBack
                        },
                        middle: {
                            type: 'text',
                            text: 'Restore Existing Wallet'
                        }
                    }
                }
            }
        }
    },
    {
        name: 'send',
        path: '/send',
        getComponent: () => Promise.resolve(require('./pages/send/send.container').default),
        config: {
            [Platform.ALL]: {
                [DeviceScreenSize.SMALL]: {
                    topBar: {
                        left: {
                            icon: 'logo'
                        }
                    },
                    bottomNav: true
                },
                [DeviceScreenSize.BIG]: {
                    drawerMenu: true
                }
            }
        }
    },
    {
        name: 'receive',
        path: '/receive',
        getComponent: () =>
            Promise.resolve(require('./pages/receive/receive.component').ReceivePage),
        config: {
            [Platform.ALL]: {
                [DeviceScreenSize.SMALL]: {
                    topBar: {
                        left: {
                            icon: 'logo'
                        }
                    },
                    bottomNav: true
                },
                [DeviceScreenSize.BIG]: {
                    drawerMenu: true
                }
            }
        }
    },
    {
        name: 'settings',
        path: '/settings',
        getComponent: () => Promise.resolve(require('./pages/settings/settings.container').default),
        config: {
            [Platform.ALL]: {
                [DeviceScreenSize.SMALL]: {
                    topBar: {
                        left: {
                            icon: 'logo'
                        },
                        middle: {
                            type: 'networkSelection'
                        },
                        right: {
                            type: 'icon',
                            icon: 'launch'
                        }
                    },
                    bottomNav: true
                },
                [DeviceScreenSize.BIG]: {
                    drawerMenu: true
                }
            }
        }
    },
    {
        name: 'transactionDetails',
        path: '/transaction/:transactionId',
        getComponent: () =>
            Promise.resolve(
                require('./pages/transaction-details/transaction-details.container').default
            ),
        config: {
            [Platform.ALL]: {
                [DeviceScreenSize.ALL]: {
                    topBar: {
                        left: {
                            icon: 'close',
                            action: goBack
                        },
                        middle: {
                            type: 'text',
                            text: 'Transaction details'
                        }
                    }
                }
            }
        }
    }
];

export const getRouteConfig = (
    routeConfig: IRouteConfig,
    platform: Platform,
    screenSize: DeviceScreenSize
): IRouteConfig => {
    let result = {};

    if (routeConfig) {
        const paths = [
            [platform, screenSize],
            [platform, DeviceScreenSize.ALL],
            [Platform.ALL, screenSize],
            [Platform.ALL, DeviceScreenSize.ALL]
        ].reverse();

        const configs = [];
        for (const path of paths) {
            if (routeConfig[path[0]] && routeConfig[path[0]][path[1]]) {
                configs.push(routeConfig[path[0]][path[1]]);
            }
        }
        result = mergeDeep({}, ...configs);
    }

    return result;
};
