import { h } from 'preact';
import { Provider } from 'preact-redux';
import App from '../app/app.container';
import { getStore } from '../app/data';
import { DeviceScreenSize, Platform } from '../app/types';
import { getScreenSizeMatchMedia } from '../app/utils/screen-size-match-media';

const store = getStore({
    pageConfig: {
        device: {
            screenSize: getScreenSizeMatchMedia().matches
                ? DeviceScreenSize.SMALL
                : DeviceScreenSize.BIG,
            platform: Platform.WEB
        },
        layout: {}
    }
});

export default props => (
    <Provider store={store}>
        <App {...props} />
    </Provider>
);
