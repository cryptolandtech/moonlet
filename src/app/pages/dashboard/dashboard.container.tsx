import { connect } from 'preact-redux';
import { IState } from '../../data';
import { DashboardPage } from './dashboard.component';
import { getWallet } from '../../utils/wallet';

const mapStateToProps = (state: IState) => {
    return {
        blockchain: state.wallet.selectedBlockchain,
        account: getWallet().getAccounts(state.wallet.selectedBlockchain)[
            state.wallet.selectedAccount
        ]
    };
};

export default connect(mapStateToProps)(DashboardPage);
