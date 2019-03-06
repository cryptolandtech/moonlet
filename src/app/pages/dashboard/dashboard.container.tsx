import { connect } from 'preact-redux';
import { IState } from '../../data';
import { DashboardPage } from './dashboard.component';
import { getWalletProvider } from '../../app-context';
import { createGetBalance } from '../../data/wallet/actions';
import { BLOCKCHAIN_INFO } from '../../utils/blockchain/blockchain-info';
import { filterAccounts } from '../../utils/blockchain/utils';

const mapStateToProps = (state: IState) => {
    const accounts = filterAccounts(state.wallet.data, true);
    const balances = state.wallet.balances || {};

    return {
        accounts,
        balances
    };
};

const mapDispatchToProps = {
    updateBalance: (blockchain, address) =>
        createGetBalance(getWalletProvider(), blockchain, address)
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DashboardPage);
