import { connect } from 'preact-redux';
import { IState } from '../../../data';
import { CreateAccountTabConnect } from './tab-connect.component';

import { filterAccounts } from '../../../utils/blockchain/utils';
import { createWalletSync } from '../../../data/wallet/actions';
import { getWalletProvider } from '../../../app-context';

const mapStateToProps = (state: IState, ownProps) => {
    const accounts = filterAccounts(
        state.wallet.data || {},
        !state.userPreferences.testNet,
        state.userPreferences.networks,
        true
    );

    return {
        ...ownProps,
        accounts
    };
};

const mapDispatchToProps = {
    syncWallet: () => createWalletSync(getWalletProvider())
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateAccountTabConnect);
