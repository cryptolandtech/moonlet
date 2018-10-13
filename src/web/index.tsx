import { h } from 'preact';
import { Provider } from 'preact-redux';
import App from '../app/app.container';
import { getStore } from '../app/data';
import { DeviceScreenSize, Platform } from '../app/types';
import { getScreenSizeMatchMedia } from '../app/utils/screen-size-match-media';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { createWallet } from '../app/utils/wallet';

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

// set testnets
import networksEth from 'moonlet-core/src/blockchain/ethereum/networks';
networksEth[0] = networksEth[2];
import networksZil from 'moonlet-core/src/blockchain/zilliqa/networks';
networksZil[0] = networksZil[1];
networksZil[0].url = 'https://scillagas-api.aws.zilliqa.com';
// networksZil[0].url = 'http://localhost:4200';

// createWallet("kid patch sample either echo supreme hungry ketchup hero away ice alcohol");

export default props => (
    <Provider store={store}>
        <App {...props} />
    </Provider>
);
