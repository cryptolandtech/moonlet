import createHashHistory from 'history/createHashHistory';
import { h } from 'preact';
import { Provider } from 'preact-redux';
import App from '../../app/app.container';
import { getStore } from '../../app/data';
import { DeviceScreenSize, Platform } from '../../app/types';
import { getScreenSizeMatchMedia } from '../../app/utils/screen-size-match-media';
import {
    createLoadWallet,
    createWalletSync,
    createGetBalance,
    createOldAccountWarning
} from '../../app/data/wallet/actions';

import { browser } from 'webextension-polyfill-ts';
import { createSetPreferences } from '../../app/data/user-preferences/actions';

import manifest from './manifest.json';
import { WalletStatus } from '../../app/data/wallet/state';
import { IUserPreferences } from '../../app/data/user-preferences/state';
import { DisclaimerPage } from '../../app/pages/settings/pages/disclaimer/disclaimer.component';
import { ConnectionPort, IExtensionMessage, ExtensionMessageType } from './types';
import { WalletEventType } from 'moonlet-core/src/core/wallet-event-emitter';
import { TransactionStatus } from 'moonlet-core/src/core/transaction';
import {
    isExtensionPopup,
    initErrorReporting,
    setExtraDataOnErrorReporting
} from '../../app/utils/platform-utils';
import { WalletPlugin } from '../../plugins/wallet/extension';
import { IPlugins } from '../../plugins/iplugins';
import { LedgerHwPlugin } from '../../plugins/ledger-hw/extension';
import { AppRemoteConfigPlugin } from '../../plugins/app-remote-config/extension';
import { getEnvironment } from './utils';
import { createUpdateApp } from '../../app/data/app/actions';
import { feature } from '../../app/utils/feature';

// define constants
const USER_PREFERENCES_STORAGE_KEY = 'userPref';
const INSTALL_ID_KEY = 'installId';

// initialize Sentry
(async () => {
    const storage = await browser.storage.local.get();
    const installId = storage[INSTALL_ID_KEY];
    initErrorReporting(manifest.version, await getEnvironment());
    setExtraDataOnErrorReporting(installId);
})();

// initialize store
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
    app: {
        version: manifest.version,
        env: 'production',
        installId: '' // TODO install id logic
    },
    userPreferences: {} as any
});

// initialize app plugins
const backgroundCommPort = browser.runtime.connect({ name: ConnectionPort.BACKGROUND } as any);
const plugins: IPlugins = {
    wallet: new WalletPlugin(backgroundCommPort),
    ledgerHw: new LedgerHwPlugin(backgroundCommPort),
    remoteConfig: new AppRemoteConfigPlugin(backgroundCommPort)
};

(async () => {
    // read extension storage
    const storage = await browser.storage.local.get();

    // update app config data
    const env = await getEnvironment();
    const installId = storage[INSTALL_ID_KEY];
    store.dispatch(createUpdateApp(env, installId));

    // get user preferences from storage
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

    // save user preferences to storage on changes
    store.subscribe(() => {
        feature.updateCurrentDimensions(store.getState());

        browser.storage.local.set({
            [USER_PREFERENCES_STORAGE_KEY]: store.getState().userPreferences
        });
    });

    // check if latest version of disclaimer was accepted
    if (userPreferences.disclaimerVersionAccepted !== DisclaimerPage.version) {
        // lock wallet if disclaimer changed or not accepted
        try {
            await plugins.wallet.lockWallet();
        } catch {
            /* */
        }
    }

    // try to load wallet
    store.dispatch(createLoadWallet(plugins.wallet, {
        testNet: userPreferences.testNet,
        networks: userPreferences.networks
    }) as any);
})();

export default props => (
    <Provider store={store}>
        <App {...props} history={createHashHistory()} {...{ plugins }} />
    </Provider>
);

if (isExtensionPopup()) {
    const body = document.getElementById('document-body');
    body.setAttribute(
        'style',
        'width: 360px; min-width:360px; max-width: 360px; height: 600px; min-height: 600px; max-height: 600px;'
    );
}

// listen for messages frm bg script
browser.runtime.onMessage.addListener((message: IExtensionMessage, sender) => {
    // accept messages only from moonlet extension
    if (sender.id !== browser.runtime.id) {
        return Promise.reject('INVALID_REQUEST');
    }

    // TODO needs refactoring
    if (message.type === ExtensionMessageType.WALLET_EVENT) {
        store.dispatch(createWalletSync(plugins.wallet) as any);

        const event = message.data;
        if (
            event.type === WalletEventType.TRANSACTION_UPDATE &&
            event.data.status === TransactionStatus.SUCCESS
        ) {
            store.dispatch(createGetBalance(
                plugins.wallet,
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
