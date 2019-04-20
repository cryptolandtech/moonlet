import createHashHistory from 'history/createHashHistory';
import { h } from 'preact';
import { Provider } from 'preact-redux';
import App from '../app/app.container';
import { getStore } from '../app/data';
import { DeviceScreenSize, Platform } from '../app/types';
import { getScreenSizeMatchMedia } from '../app/utils/screen-size-match-media';
import {
    createLoadWallet,
    createWalletSync,
    createGetBalance,
    createOldAccountWarning
} from '../app/data/wallet/actions';
import { ExtensionWalletProvider } from './extension-wallet-provider';

import { browser } from 'webextension-polyfill-ts';
import { createSetPreferences } from '../app/data/user-preferences/actions';
import { createUpdateConversionRates } from '../app/data/currency/actions';

import manifest from './manifest.json';
import { WalletStatus } from '../app/data/wallet/state';
import { IUserPreferences } from '../app/data/user-preferences/state';
import { DisclaimerPage } from '../app/pages/settings/pages/disclaimer/disclaimer.component';
import { ConnectionPort, IExtensionMessage, ExtensionMessageType } from './types';
import { WalletEventType } from 'moonlet-core/src/core/wallet-event-emitter';
import { TransactionStatus } from 'moonlet-core/src/core/transaction';
import { GoogleDriveProvider } from '../app/utils/cloud-storage/google-drive-provider';

const USER_PREFERENCES_STORAGE_KEY = 'userPref';

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
        status: WalletStatus.LOADING
    },
    extension: {
        version: manifest.version
    },
    userPreferences: {} as any
});

const backgroundCommPort = browser.runtime.connect({ name: ConnectionPort.BACKGROUND } as any);
const walletProvider = new ExtensionWalletProvider(backgroundCommPort);

(async () => {
    const storage = await browser.storage.local.get();
    let userPreferences: IUserPreferences = {
        preferredCurrency: 'USD',
        devMode: false,
        testNet: false,
        networks: {}
    };

    if (storage[USER_PREFERENCES_STORAGE_KEY]) {
        userPreferences = { ...userPreferences, ...storage[USER_PREFERENCES_STORAGE_KEY] };
    }
    store.dispatch(createSetPreferences(userPreferences));

    if (userPreferences.disclaimerVersionAccepted !== DisclaimerPage.version) {
        // lock wallet if disclaimer changed or not accepted
        try {
            await walletProvider.lockWallet();
        } catch {
            /* */
        }
    }
    store.dispatch(createLoadWallet(walletProvider, {
        testNet: userPreferences.testNet,
        networks: userPreferences.networks
    }) as any);

    store.dispatch(createUpdateConversionRates() as any);
    setInterval(() => store.dispatch(createUpdateConversionRates() as any), 10 * 60 * 1000);
})();

store.subscribe(() => {
    browser.storage.local.set({
        [USER_PREFERENCES_STORAGE_KEY]: store.getState().userPreferences
    });
});

export default props => (
    <Provider store={store}>
        <App {...props} history={createHashHistory()} {...{ walletProvider }} />
    </Provider>
);

if (document.location.search.indexOf('popup=1') > 0) {
    const body = document.getElementById('document-body');
    body.setAttribute(
        'style',
        'width: 360px; min-width:360px; max-width: 360px; height: 600px; min-height: 600px; max-height: 600px;'
    );
}

const port = browser.runtime.connect({ name: ConnectionPort.POPUP_DETECTION } as any);
browser.windows.getCurrent().then(w => {
    port.postMessage({
        type: 'currentWindow',
        window: w
    });

    window.onfocus = () => {
        port.postMessage({
            type: 'currentWindow',
            window: w
        });
    };

    window.onblur = () => {
        port.postMessage({
            type: 'currentWindow',
            window: {}
        });
    };
});

browser.runtime.onMessage.addListener((message: IExtensionMessage, sender) => {
    // accept messages only from moonlet extension
    if (sender.id !== browser.runtime.id) {
        return Promise.reject('INVALID_REQUEST');
    }

    if (message.type === ExtensionMessageType.WALLET_EVENT) {
        store.dispatch(createWalletSync(walletProvider) as any);

        const event = message.data;
        if (
            event.type === WalletEventType.TRANSACTION_UPDATE &&
            event.data.status === TransactionStatus.SUCCESS
        ) {
            store.dispatch(createGetBalance(
                walletProvider,
                event.data.blockchain,
                event.data.address
            ) as any);
        }
    }

    if (message.type === ExtensionMessageType.OLD_WALLET_DETECTED) {
        setTimeout(() => store.dispatch(createOldAccountWarning(true)), 2000);
    }

    return Promise.resolve({ success: true });
});
