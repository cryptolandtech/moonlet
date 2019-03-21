import { Component, h, RenderableProps } from 'preact';
import AsyncRoute from 'preact-async-route';
import { CustomHistory, Router, RouterOnChangeArgs, route } from 'preact-router';

import './app.scss';
import { IRouteConfig, ROUTES } from './routes';
import { DeviceScreenSize } from './types';
import { getScreenSizeMatchMedia } from './utils/screen-size-match-media';
import DefaultLayout from './layouts/default/default.container';
import { loadTranslations, Language } from './utils/translate';
import { IWalletProvider } from './iwallet-provider';
import { appContext } from './app-context';
import { WalletStatus } from './data/wallet/state';
import { GenericAccount } from 'moonlet-core/src/core/account';

interface IProps {
    history: CustomHistory;
    walletProvider: IWalletProvider;
    language: Language;

    walletStatus: WalletStatus;
    accounts: GenericAccount[];

    onScreenSizeChange: { (screenSize: DeviceScreenSize) };
    onRouteChange: { (routeConfig: IRouteConfig) };
}

interface IState {
    screenSize: DeviceScreenSize;
    translationsLoaded: boolean;
}

export default class App extends Component<IProps, IState> {
    private phoneMediaQuery;
    private route: RouterOnChangeArgs;
    private redirectAfterWalletLoaded: string;

    constructor(props: RenderableProps<IProps>) {
        super(props);

        loadTranslations(props.language).then(() => {
            this.setState({ translationsLoaded: true });
        });

        appContext('walletProvider', props.walletProvider);

        this.phoneMediaQuery = getScreenSizeMatchMedia();
        this.phoneMediaQuery.addListener(this.onPhoneMediaQueryChange.bind(this));

        this.state = {
            translationsLoaded: false,
            screenSize: this.phoneMediaQuery.matches ? DeviceScreenSize.SMALL : DeviceScreenSize.BIG
        };
    }

    public componentDidUpdate(prevProps: IProps) {
        if (this.props.walletStatus !== prevProps.walletStatus) {
            // console.log('component did update', prevProps.walletStatus, this.props.walletStatus);
            this.doRedirects();
        }
    }

    public checkAccountAndRedirect() {
        const currentRoute = this.route ? this.route.current : undefined;

        if (
            currentRoute &&
            currentRoute.attributes &&
            currentRoute.attributes.blockchain &&
            currentRoute.attributes.address
        ) {
            const { blockchain, address } = currentRoute.attributes;

            if (this.props.accounts.length > 0) {
                const account = this.props.accounts.filter(
                    acc =>
                        !acc.disabled &&
                        acc.node.blockchain === blockchain &&
                        acc.address === address
                )[0];

                if (!account) {
                    if (this.state.screenSize === DeviceScreenSize.BIG) {
                        route(
                            `/account/${this.props.accounts[0].node.blockchain}/${
                                this.props.accounts[0].address
                            }`
                        );
                    } else {
                        route('/dashboard');
                    }
                }
            } else {
                route('/dashboard');
            }
        } else if (
            this.state.screenSize === DeviceScreenSize.BIG &&
            currentRoute &&
            currentRoute.attributes &&
            currentRoute.attributes.name === 'dashboard' &&
            this.props.accounts.length > 0
        ) {
            route(
                `/account/${this.props.accounts[0].node.blockchain}/${
                    this.props.accounts[0].address
                }`
            );
        }
    }

    public doRedirects() {
        // console.log('doRedirects', this.redirectAfterWalletLoaded);
        const currentRoute = this.route ? this.route.current : undefined;
        const walletStatus = this.props.walletStatus;

        if (currentRoute) {
            if (walletStatus === WalletStatus.UNLOCKED) {
                if (this.redirectAfterWalletLoaded) {
                    // wallet loaded but -> user will be redirected to desired page
                    // console.log('redirect', 1);
                    route(this.redirectAfterWalletLoaded);
                    this.redirectAfterWalletLoaded = undefined;
                } else if (['/', '/import-wallet', '/create-wallet'].indexOf(this.route.url) >= 0) {
                    // go to dashboard as user already has a wallet
                    // console.log('redirect', 2);
                    route('/dashboard');
                } else {
                    this.checkAccountAndRedirect();
                }
            } else if (walletStatus === WalletStatus.LOADING) {
                // do nothing, wait for wallet to load :)
            } else {
                if (currentRoute.attributes && currentRoute.attributes.withoutWalletInstance) {
                    // let route without wallet loaded
                } else {
                    this.redirectAfterWalletLoaded = this.route.url || '/dashboard';
                    if (this.redirectAfterWalletLoaded.startsWith('/settings')) {
                        this.redirectAfterWalletLoaded = '/dashboard';
                    }
                    // console.log('redirect', 3);
                    route('/');
                }
            }
        }
    }

    public onPhoneMediaQueryChange(media) {
        if (media.matches) {
            this.setState({ screenSize: DeviceScreenSize.SMALL });
            this.props.onScreenSizeChange(DeviceScreenSize.SMALL);
        } else {
            this.setState({ screenSize: DeviceScreenSize.BIG });
            this.props.onScreenSizeChange(DeviceScreenSize.BIG);
        }
    }

    public handleRouteChange(e: RouterOnChangeArgs) {
        // console.log(e.url);
        if (e.current) {
            this.route = e;

            // console.log('new route', this.route);
            // this.doRedirects();
            this.props.onRouteChange(e.current.attributes.config);
        }
    }

    public render(props: RenderableProps<IProps>) {
        const className = `app-root screen-${this.state.screenSize.toLocaleLowerCase()}`;

        return (
            <div className={className}>
                {this.state.translationsLoaded && (
                    <DefaultLayout>
                        <Router
                            history={props.history}
                            onChange={this.handleRouteChange.bind(this)}
                        >
                            {ROUTES.map(routeConfig => (
                                <AsyncRoute {...routeConfig} />
                            ))}
                        </Router>
                    </DefaultLayout>
                )}
            </div>
        );
    }
}
