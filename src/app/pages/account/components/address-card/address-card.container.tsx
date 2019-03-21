import { connect } from 'preact-redux';

import { IState } from '../../../../data';
import { filterAccounts } from '../../../../utils/blockchain/utils';
import { AddressCard } from './address-card.component';
import { createRemoveAccount } from '../../../../data/wallet/actions';
import { getWalletProvider } from '../../../../app-context';

const mapStateToProps = (state: IState, ownProps) => {
    const accounts = filterAccounts(
        state.wallet.data || {},
        !state.userPreferences.testNet,
        state.userPreferences.networks
    );

    return {
        accounts,
        screenSize: state.pageConfig.device.screenSize
    };
};

const mapDispatchToProps = {
    removeAccount: (blockchain, address) =>
        createRemoveAccount(getWalletProvider(), blockchain, address)
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddressCard);
