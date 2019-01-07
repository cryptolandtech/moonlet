import createHashHistory from 'history/createHashHistory';
import { h } from 'preact';
import { Provider } from 'preact-redux';
import App from '../app/app.container';
import { getStore } from '../app/data';
import { DeviceScreenSize, Platform } from '../app/types';
import { getScreenSizeMatchMedia } from '../app/utils/screen-size-match-media';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { createLoadWallet } from '../app/data/wallet/actions';
import { ExtensionWalletProvider } from './wallet-provider';

import { VERSION } from './version';

const store = getStore({
    pageConfig: {
        device: {
            screenSize: getScreenSizeMatchMedia().matches
                ? DeviceScreenSize.SMALL
                : DeviceScreenSize.BIG,
            platform: Platform.EXTENSION
        },
        layout: {}
    },
    wallet: {
        invalidPassword: false,
        loadingInProgress: true,
        loaded: false,
        locked: false,
        selectedBlockchain: Blockchain.ZILLIQA,
        selectedNetwork: 0,
        selectedAccount: 0
    },
    extension: {
        version: VERSION
    }
});
const walletProvider = new ExtensionWalletProvider();
store.dispatch(createLoadWallet(walletProvider) as any);

export default props => (
    <Provider store={store}>
        <App {...props} history={createHashHistory()} walletProvider={walletProvider} />
    </Provider>
);

if (document.location.search.indexOf('popup=1') > 0) {
    const body = document.getElementById('document-body');
    body.setAttribute(
        'style',
        'width: 360px; min-width:360px; max-width: 360px; height: 600px; min-height: 600px; max-height: 600px;'
    );
}
