import { h } from 'preact';
import { Provider } from 'preact-redux';
import App from '../app/app.container';
import { getStore } from '../app/data';
import { DeviceScreenSize, Platform } from '../app/types';
import { getScreenSizeMatchMedia } from '../app/utils/screen-size-match-media';
import { createWallet } from '../app/utils/wallet';
import { Blockchain } from 'moonlet-core/src/core/blockchain';

const store = getStore({
    pageConfig: {
        device: {
            screenSize: getScreenSizeMatchMedia().matches
                ? DeviceScreenSize.SMALL
                : DeviceScreenSize.BIG,
            platform: Platform.WEB
        },
        layout: {}
    },
    wallet: {
        selectedBlockchain: Blockchain.ETHEREUM,
        selectedNetwork: 0,
        selectedAccount: 0
    }
});

const wallet = createWallet();
wallet.createAccount(Blockchain.ZILLIQA);
wallet.createAccount(Blockchain.ETHEREUM);

export default props => (
    <Provider store={store}>
        <App {...props} />
    </Provider>
);
