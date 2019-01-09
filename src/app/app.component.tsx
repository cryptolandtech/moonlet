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

interface IProps {
    history: CustomHistory;
    walletProvider: IWalletProvider;
    language: Language;

    walletLoaded: boolean;
    walletLoadingInProgress: boolean;
    walletLocked: boolean;

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

    public componentDidUpdate() {
        this.doRedirects();
    }

    public doRedirects() {
        const walletOk =
            !this.props.walletLoadingInProgress &&
            this.props.walletLoaded &&
            !this.props.walletLocked;

        if (walletOk && this.redirectAfterWalletLoaded) {
            route(this.redirectAfterWalletLoaded);
            this.redirectAfterWalletLoaded = undefined;
        } else if (
            walletOk &&
            ['/', '/import-wallet', '/create-wallet'].indexOf(this.route.url) >= 0
        ) {
            route('/dashboard');
        } else if (
            !this.props.walletLoadingInProgress &&
            !this.route.current.attributes.withoutWalletInstance &&
            !walletOk
        ) {
            this.redirectAfterWalletLoaded = this.route.url || '/dashboard';
            route('/');
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
        this.route = e;
        // this.doRedirects();
        this.props.onRouteChange(e.current.attributes.config);
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
