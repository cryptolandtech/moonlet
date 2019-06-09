import { h, Component } from 'preact';

import { Translate } from './components/translate/translate.component';
import { browser } from 'webextension-polyfill-ts';
import { goBack } from './data/page-config/actions';
import { ILayout } from './data/page-config/state';
import { IRoute } from './routes';
import { DeviceScreenSize, Platform } from './types';
import { mergeDeep } from './utils/merge-deep';
import { translate } from './utils/translate';
import { isExtension } from './utils/platform-utils';

export type IRouteConfig = ILayout;

interface IConfig {
    [platform: string]: {
        [screenSize: string]: IRouteConfig;
    };
}
export interface IRoute {
    name: string;
    path: string;
    component?: Component;
    getComponent?: () => Promise<Component>;
    withoutWalletInstance?: boolean;
    config: IConfig;
}

const dashboardConfig: IRouteConfig = {
    topBar: {
        secondRow: {
            type: 'total-balance'
        },
        left: {
            icon: 'logo'
        },
        right: {
            type: 'menu',
            icon: 'more_vert',
            menuWidth: 220,
            items: [
                {
                    text: <Translate text="DashboardPage.menu.addNewAccount" />,
                    icon: 'add_circle_outline',
                    href: '/create-account'
                },
                {
                    text: <Translate text="DashboardPage.menu.openNewTab" />,
                    icon: 'launch',
                    action: () => {
                        browser.tabs.create({
                            url: document.location.href.replace('popup=1', '')
                        });
                    }
                },
                {
                    text: <Translate text="App.labels.settings" />,
                    icon: 'settings',
                    href: '/settings'
                },
                {
                    divider: true
                },
                {
                    text: <Translate text="App.labels.reportIssue" />,
                    href: 'https://moonlet.xyz/links/support',
                    target: '_blank',
                    icon: 'bug_report'
                },
                {
                    text: <Translate text="App.labels.giveFeedback" />,
                    href: 'https://moonlet.xyz/links/feedback',
                    target: '_blank',
                    icon: 'feedback'
                },
                {
                    text: <Translate text="SupportUsPage.title" />,
                    href: '/support-us',
                    icon: 'sentiment_satisfied_alt'
                },
                {
                    text: <Translate text="App.labels.getZilDomain" />,
                    href: 'https://moonlet.xyz/links/ud',
                    target: '_blank',
                    icon: 'shopping_cart'
                }
            ]
        }
    }
};

const popupPageConfig = (titleTextKey): IConfig => {
    let text = <Translate text={titleTextKey} />;
    if (typeof titleTextKey === 'function') {
        text = titleTextKey;
    }

    return {
        [Platform.ALL]: {
            [DeviceScreenSize.ALL]: {
                topBar: {
                    options: {
                        theme: 'white'
                    },
                    left: {
                        icon: 'close',
                        action: goBack
                    },
                    middle: {
                        type: 'text',
                        text
                    }
                }
            }
        }
    };
};

export const ROUTES: IRoute[] = [
    {
        name: 'landingPage',
        path: '/',
        // getComponent: () => import('./pages/landing/landing.container').then(module => module.default),
        component: require('./pages/landing/landing.container').default,
        withoutWalletInstance: true,
        config: {
            [Platform.ALL]: {
                [DeviceScreenSize.ALL]: {
                    options: {
                        backgroundColor: 'primary'
                    },
                    topBar: {}
                }
            }
        }
    },
    {
        name: 'dashboard',
        path: '/dashboard',
        // getComponent: () =>
        //     import('./pages/dashboard/dashboard.container').then(module => module.default),
        component: require('./pages/dashboard/dashboard.container').default,
        config: {
            [Platform.ALL]: {
                [DeviceScreenSize.ALL]: dashboardConfig
            }
        }
    },
    {
        name: 'createWallet',
        path: '/create-wallet',
        // getComponent: () =>
        //     import('./pages/create-wallet/create-wallet.container').then(module => module.default),
        component: require('./pages/create-wallet/create-wallet.container').default,
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
                            text: <Translate text="CreateWalletPage.title" />
                        }
                    }
                }
            }
        }
    },
    {
        name: 'importWallet',
        path: '/import-wallet/:importType?',
        // getComponent: () =>
        //     import('./pages/import-wallet/import-wallet.container').then(module => module.default),
        component: require('./pages/import-wallet/import-wallet.container').default,
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
                            text: <Translate text="ImportWalletPage.title" />
                        }
                    }
                }
            }
        }
    },
    {
        name: 'send',
        path: '/send/:blockchain/:address',
        // getComponent: () => import('./pages/send/send.container').then(module => module.default),
        component: require('./pages/send/send.container').default,
        config: popupPageConfig('App.labels.send')
    },
    {
        name: 'receive',
        path: '/receive/:blockchain/:address',
        // getComponent: () =>
        //     import('./pages/receive/receive.container').then(module => module.default),
        component: require('./pages/receive/receive.container').default,
        config: popupPageConfig('App.labels.receive')
    },
    {
        name: 'settingsDisclaimer',
        path: '/settings/disclaimer',
        // getComponent: () =>
        //     import('./pages/settings/pages/disclaimer/disclaimer.component').then(
        //         module => module.DisclaimerPage as any
        //     ),
        component: require('./pages/settings/pages/disclaimer/disclaimer.component').DisclaimerPage,
        config: popupPageConfig('DisclaimerPage.title')
    },
    {
        name: 'settingsCurrency',
        path: '/settings/currency',
        // getComponent: () =>
        //     import('./pages/settings/pages/currency/currency.container').then(
        //         module => module.default
        //         ),
        component: require('./pages/settings/pages/currency/currency.container').default,
        config: popupPageConfig('CurrencyPage.title')
    },
    {
        name: 'settingsZilliqaAccountRecover',
        path: '/settings/zilliqa-account-recover',
        getComponent: () =>
            import('./pages/settings/pages/zilliqa-account-recover/zilliqa-account-recover.container').then(
                module => module.default
            ),
        // component: require('./pages/settings/pages/zilliqa-account-recover/zilliqa-account-recover.container').default,
        config: popupPageConfig('ZilliqaAccountRecoverPage.title')
    },
    {
        name: 'settingsNetworkOptions',
        path: '/settings/networkOptions/:blockchain?',
        // getComponent: () =>
        //     import('./pages/settings/pages/network-options/network-options.container').then(
        //         module => module.default
        //     ),
        component: require('./pages/settings/pages/network-options/network-options.container')
            .default,
        config: popupPageConfig('NetworkOptionsPage.title')
    },
    {
        name: 'settingsBackup',
        path: '/settings/backup',
        // getComponent: () =>
        //     import('./pages/settings/pages/backup/backup.component').then(
        //         module => module.default
        //     ),
        component: require('./pages/settings/pages/backup/backup.component').BackupPage,
        config: popupPageConfig('App.labels.backup')
    },
    {
        name: 'settings',
        path: '/settings/:level1?',
        // getComponent: () =>
        //     import('./pages/settings/settings.container').then(module => module.default),
        component: require('./pages/settings/settings.container').default,
        config: {
            [Platform.ALL]: {
                [DeviceScreenSize.ALL]: {
                    topBar: {
                        left: {
                            icon: 'navigate_before',
                            action: goBack
                        },
                        middle: {
                            type: 'text',
                            text: () => {
                                const level1 =
                                    (isExtension() ? location.hash : location.pathname).split(
                                        '/'
                                    )[2] || '';

                                switch (level1) {
                                    case 'security':
                                        return <Translate text="SettingsPage.security" />;
                                    case 'developerOptions':
                                        return <Translate text="SettingsPage.developerOptions" />;
                                    default:
                                        return <Translate text="App.labels.settings" />;
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    {
        name: 'transactionDetails',
        path: '/transaction/:blockchain/:address/:transactionId',
        // getComponent: () =>
        //     import('./pages/transaction-details/transaction-details.container').then(
        //         module => module.default
        //     ),
        component: require('./pages/transaction-details/transaction-details.container').default,
        config: popupPageConfig('TransactionDetailsPage.title')
    },
    {
        name: 'reveal',
        path: '/reveal/:type/:blockchain?/:address?',
        // getComponent: () =>
        //     import('./pages/reveal/reveal.container').then(module => module.default),
        component: require('./pages/reveal/reveal.container').default,
        config: popupPageConfig(() =>
            translate(
                `RevealPage.${
                    (isExtension() ? location.hash : location.pathname).split('/')[2]
                }.title`
            )
        )
    },
    {
        name: 'create-account',
        path: '/create-account',
        // getComponent: () =>
        //     import('./pages/create-account/create-account.component').then(
        //         module => module.CreateAccountPage
        //     ),
        component: require('./pages/create-account/create-account.component').CreateAccountPage,
        config: popupPageConfig(() => translate(`CreateAccountPage.title`))
    },
    {
        name: 'transaction-confirmation',
        path: '/transaction-confirmation',
        // getComponent: () =>
        //     import('./pages/transaction-confirmation/transaction-confirmation.container').then(
        //         module => module.default
        //     ),
        component: require('./pages/transaction-confirmation/transaction-confirmation.container')
            .default,
        config: {}
    },
    {
        name: 'confirmation-screen',
        path: '/confirmation-screen',
        component: require('./pages/confirmation-screen/confirmation-screen.container').default,
        config: {}
    },
    {
        name: 'account',
        path: '/account/:blockchain/:address',
        // getComponent: () =>
        //     import('./pages/account/account.container').then(module => module.default),
        component: require('./pages/account/account.container').default,
        config: {
            [Platform.ALL]: {
                [DeviceScreenSize.SMALL]: {
                    topBar: {
                        left: {
                            icon: 'navigate_before',
                            action: goBack
                        },
                        middle: {
                            type: 'tokenPageTitle'
                        }
                    }
                },
                [DeviceScreenSize.BIG]: dashboardConfig
            }
        }
    },
    {
        name: 'support-us',
        path: '/support-us',
        // getComponent: () =>
        //     import('./pages/settings/pages/disclaimer/disclaimer.component').then(
        //         module => module.DisclaimerPage as any
        //     ),
        component: require('./pages/support-us/support-us.component').SupportUsPage,
        config: popupPageConfig('SupportUsPage.title')
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
