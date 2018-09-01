import { h } from 'preact';
import App from "../app/app.container"
import createHashHistory from 'history/createHashHistory';
import { getStore } from '../app/data';
import { Provider } from 'preact-redux';
import { getScreenSizeMatchMedia } from '../app/utils/screen-size-match-media';
import { Platform, DeviceScreenSize } from '../app/types';

const store = getStore({
    pageConfig: {
        device: {
            screenSize: getScreenSizeMatchMedia().matches ? DeviceScreenSize.SMALL : DeviceScreenSize.BIG,
            platform: Platform.EXTENSION
        }
    }
});

export default (props) => (
    <Provider store={store}>
        <App {...props} history={createHashHistory()}></App>
    </Provider>
);