import { h } from 'preact';
import { Provider } from 'preact-redux';
import App from '../app/app.container';
import { getStore } from '../app/data';
import { DeviceScreenSize, Platform } from '../app/types';
import { getScreenSizeMatchMedia } from '../app/utils/screen-size-match-media';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { createWallet } from '../app/utils/wallet';
import { createWalletLoaded } from '../app/data/wallet/actions';

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
        selectedAccount: 0
    }
});

// set testnets
import networksEth from 'moonlet-core/src/blockchain/ethereum/networks';
networksEth[0] = networksEth[2];
import networksZil from 'moonlet-core/src/blockchain/zilliqa/networks';
networksZil[0] = networksZil[1];
networksZil[0].url = 'https://testnetv3a-api.aws.zilliqa.com';

// networksZil[0].url = 'http://localhost:4200';

// (async() => {
//     await createWallet("kid patch sample either echo supreme hungry ketchup hero away ice alcohol");
//     store.dispatch(createWalletLoaded(false, true, false));
// })();

export default props => (
    <Provider store={store}>
        <App {...props} />
    </Provider>
);
