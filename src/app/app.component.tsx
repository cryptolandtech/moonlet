import { Component, h, RenderableProps } from 'preact';
import AsyncRoute from 'preact-async-route';
import { CustomHistory, Router, RouterOnChangeArgs } from 'preact-router';

import './app.scss';
import { IRouteConfig, ROUTES } from './routes';
import { DeviceScreenSize } from './types';
import { getScreenSizeMatchMedia } from './utils/screen-size-match-media';
import DefaultLayout from './layouts/default/default.container';
import { loadTranslations, Language } from './utils/translate';

interface IProps {
    history: CustomHistory;
    language: Language;

    onScreenSizeChange: { (screenSize: DeviceScreenSize) };
    onRouteChange: { (routeConfig: IRouteConfig) };
}

interface IState {
    translationsLoaded: boolean;
}

export default class App extends Component<IProps, IState> {
    public state;
    private phoneMediaQuery;

    constructor(props: RenderableProps<IProps>) {
        super(props);

        this.state = {
            translationsLoaded: false
        };

        loadTranslations(props.language).then(() => {
            this.setState({ translationsLoaded: true });
        });

        this.phoneMediaQuery = getScreenSizeMatchMedia();
        this.phoneMediaQuery.addListener(this.onPhoneMediaQueryChange.bind(this));
    }

    public onPhoneMediaQueryChange(media) {
        if (media.matches) {
            this.props.onScreenSizeChange(DeviceScreenSize.SMALL);
        } else {
            this.props.onScreenSizeChange(DeviceScreenSize.BIG);
        }
    }

    public handleRouteChange(route: RouterOnChangeArgs) {
        // console.log(route);
        this.props.onRouteChange(route.current.attributes.config);
    }

    public render(props: RenderableProps<IProps>) {
        // console.log("app props", props);
        return (
            <div class="app-root">
                {this.state.translationsLoaded && (
                    <DefaultLayout>
                        <Router
                            history={props.history}
                            onChange={this.handleRouteChange.bind(this)}
                        >
                            {ROUTES.map(route => (
                                <AsyncRoute {...route} />
                            ))}
                        </Router>
                    </DefaultLayout>
                )}
            </div>
        );
    }
}
