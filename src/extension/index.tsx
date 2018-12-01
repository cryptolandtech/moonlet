import createHashHistory from 'history/createHashHistory';
import { h } from 'preact';
import { Provider } from 'preact-redux';
import App from '../app/app.container';
import { getStore } from '../app/data';
import { DeviceScreenSize, Platform } from '../app/types';
import { getScreenSizeMatchMedia } from '../app/utils/screen-size-match-media';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { getPassword, storeWallet, removePassword } from '../app/utils/wallet';
import { createLoadWallet } from '../app/data/wallet/actions';

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
    }
});

store.dispatch(createLoadWallet() as any);

// set testnets
import networksEth from 'moonlet-core/src/blockchain/ethereum/networks';
networksEth[0] = networksEth[2];
import networksZil from 'moonlet-core/src/blockchain/zilliqa/networks';
networksZil[0] = networksZil[1];
networksZil[0].url = 'https://testnetv3-api.aws.zilliqa.com';
// networksZil[0].url = 'http://localhost:4200';

// createWallet("kid patch sample either echo supreme hungry ketchup hero away ice alcohol");
export default props => (
    <Provider store={store}>
        <App {...props} history={createHashHistory()} />
    </Provider>
);

if (document.location.search.indexOf('popup=1') > 0) {
    const body = document.getElementById('document-body');
    body.setAttribute(
        'style',
        'width: 360px; min-width:360px; max-width: 360px; height: 600px; min-height: 600px; max-height: 600px;'
    );
}

setInterval(async () => {
    const pass = await getPassword();
    if (pass) {
        storeWallet(pass);
    }
}, 5000);
