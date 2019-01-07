import { connect } from 'preact-redux';
import { IState } from '../../data';
import { DashboardPage } from './dashboard.component';
import { getWalletProvider } from '../../app-context';
import { createGetBalance } from '../../data/wallet/actions';
import { BLOCKCHAIN_INFO } from '../../utils/blockchain/blockchain-info';

const mapStateToProps = (state: IState) => {
    const blockchain = state.wallet.selectedBlockchain;
    const account = state.wallet.data.accounts[blockchain][state.wallet.selectedAccount];
    const balances = state.wallet.balances || {};
    const accountsBalances = balances[blockchain] || {};
    const balance = accountsBalances[account.address] || { loading: true, amount: '' };

    return {
        blockchain,
        blockchainInfo: BLOCKCHAIN_INFO[state.wallet.selectedBlockchain],
        account,
        balance
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
