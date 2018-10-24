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
        getComponent: () =>
            import('./pages/landing/landing.container').then(module => module.default),
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
            import('./pages/dashboard/dashboard.container').then(module => module.default),
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
            import('./pages/create-wallet/create-wallet.container').then(module => module.default),
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
            import('./pages/import-wallet/import-wallet.container').then(module => module.default),
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
        getComponent: () => import('./pages/send/send.container').then(module => module.default),
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
            }
        }
    },
    {
        name: 'receive',
        path: '/receive',
        getComponent: () =>
            import('./pages/receive/recieve.container').then(module => module.default),
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
            }
        }
    },
    {
        name: 'settings',
        path: '/settings',
        getComponent: () =>
            import('./pages/settings/settings.container').then(module => module.default),
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
            import('./pages/transaction-details/transaction-details.container').then(
                module => module.default
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
    },
    {
        name: 'revealSecretPhrase',
        path: '/revealSecretPhrase',
        getComponent: () =>
            import('./pages/reveal/reveal.container').then(module => module.default),
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
                            text: 'Reveal Secret Phrase'
                        }
                    }
                }
            }
        }
    },
    {
        name: 'revealPrivateKey',
        path: '/revealPrivateKey',
        getComponent: () =>
            import('./pages/reveal/reveal.container').then(module => module.default),
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
                            text: 'Reveal Private Key'
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
