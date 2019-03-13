import { h } from 'preact';
import { Provider } from 'preact-redux';
import App from '../app/app.container';
import { getStore } from '../app/data';
import { DeviceScreenSize, Platform } from '../app/types';
import { getScreenSizeMatchMedia } from '../app/utils/screen-size-match-media';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { WebWalletProvider } from './wallet-provider';
import { createWalletLoaded } from '../app/data/wallet/actions';
import { IWalletProvider } from '../app/iwallet-provider';
import { IUserPreferences } from '../app/data/user-preferences/state';
import { createUpdateConversionRates } from '../app/data/currency/actions';

const loadState = (): IUserPreferences => {
    const defaults = {
        preferredCurrency: 'USD',
        devMode: false,
        testNet: false,
        networks: {}
    };

    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return defaults;
        }
        return { ...defaults, ...JSON.parse(serializedState) };
    } catch (err) {
        return defaults;
    }
};

const saveState = state => {
    try {
        const serializedState = JSON.stringify(state.userPreferences);
        localStorage.setItem('state', serializedState);
    } catch {
        // ignore write errors
    }
};

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
        invalidPassword: false,
        loadingInProgress: false,
        loaded: false,
        locked: false,
        selectedBlockchain: Blockchain.ZILLIQA,
        selectedNetwork: 0,
        selectedAccount: 0,
        data: {
            accounts: []
        }
    },
    userPreferences: loadState()
});

store.subscribe(() => saveState(store.getState()));

const walletProvider: IWalletProvider = new WebWalletProvider();

(async () => {
    const wallet = await walletProvider.createWallet(
        'gadget clean certain tiger abandon prevent light pluck muscle obtain mobile agree',
        'asd'
    );
    // console.log(await walletProvider.getAccounts({ ZILLIQA: 2 }));
    store.dispatch(createWalletLoaded(false, true, false, wallet));

    store.dispatch(createUpdateConversionRates() as any);
    setInterval(() => store.dispatch(createUpdateConversionRates() as any), 5 * 60 * 1000);
})();

export default props => (
    <Provider store={store}>
        <App {...props} walletProvider={walletProvider} />
    </Provider>
);
