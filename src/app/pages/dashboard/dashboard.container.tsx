import { connect } from 'preact-redux';
import { IState } from '../../data';
import { DashboardPage } from './dashboard.component';
import { getWalletPlugin } from '../../app-context';
import { createGetBalance, createOldAccountWarning } from '../../data/wallet/actions';
import { filterAccounts } from '../../../utils/blockchain/utils';
import { createDismissXSellDashboard } from '../../data/user-preferences/actions';

const mapStateToProps = (state: IState, ownProps) => {
    const accounts = filterAccounts(
        state.wallet.data || {},
        !state.userPreferences.testNet,
        state.userPreferences.networks
    );
    const balances = state.wallet.balances || {};

    return {
        ...ownProps,
        accounts,
        balances,
        device: state.pageConfig.device,
        userPreferences: state.userPreferences,
        oldAccountWarning: state.wallet.oldAccountWarning
    };
};

const mapDispatchToProps = {
    updateBalance: (blockchain, address) =>
        createGetBalance(getWalletPlugin(), blockchain, address),
    dismissXSell: createDismissXSellDashboard,
    showOldAccountWarning: createOldAccountWarning
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DashboardPage);
