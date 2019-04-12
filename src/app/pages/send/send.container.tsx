import { connect } from 'preact-redux';
import { IState } from '../../data';
import { SendPage } from './send.component';
import { BLOCKCHAIN_INFO } from '../../utils/blockchain/blockchain-info';
import { createTransfer } from '../../data/wallet/actions';
import { getWalletProvider } from '../../app-context';
import { getAccountFromState } from '../../utils/blockchain/utils';
import { IAccountBalance } from '../../data/wallet/state';
const mapStateToProps = (state: IState, ownProps) => {
    const { blockchain, address } = ownProps;

    const account = getAccountFromState(state, blockchain, address);
    let balance: IAccountBalance = { loading: true, amount: undefined, lastUpdate: undefined };
    if (
        state.wallet.balances &&
        state.wallet.balances[blockchain] &&
        state.wallet.balances[blockchain][account.address]
    ) {
        balance = state.wallet.balances[blockchain][account.address];
    }

    return {
        blockchain: account.node.blockchain,
        blockchainInfo: BLOCKCHAIN_INFO[account.node.blockchain],
        account,
        balance: parseFloat((balance.amount || '').toString()),
        transferInfo: state.wallet.transfer || {},
        userPreferences: state.userPreferences
    };
};

const mapDispatchToProps = {
    transfer: (blockchain, fromAddress, toAddress, amount, feeOptions) =>
        createTransfer(getWalletProvider(), blockchain, fromAddress, toAddress, amount, feeOptions)
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SendPage);
