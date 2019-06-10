import { connect } from 'preact-redux';
import { IState } from '../../../../data';

import { TransactionConfirmationPage } from './transaction-confirmation.component';
import { filterAccounts } from '../../../../../utils/blockchain/utils';
import { BLOCKCHAIN_INFO } from '../../../../../utils/blockchain/blockchain-info';
import { capitalize } from '../../../../utils/string';

const mapStateToProps = (state: IState, ownProps) => {
    const blockchain = ownProps.params.blockchain;
    const testNet = (state.userPreferences || ({} as any)).testNet;
    const wallet = state.wallet.data;

    const networks = BLOCKCHAIN_INFO[blockchain].networks;
    const currentNetworkId = wallet ? wallet.currentNetworks[blockchain] : 0;
    const currentNetworkName = `${capitalize(blockchain)} ${networks[currentNetworkId].name}${
        testNet ? ' Testnet' : ''
    }`;

    const accounts = filterAccounts(
        state.wallet.data,
        !state.userPreferences.testNet,
        state.userPreferences.networks
    )
        .filter(account => account.node.blockchain === blockchain)
        .map(account => account.address);

    return {
        ...ownProps,
        testNet,
        currentNetworkName,
        currentNetworkId,
        accounts,
        walletReady: !!state.wallet.data
    };
};

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionConfirmationPage);
