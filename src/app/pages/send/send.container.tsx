import { connect } from 'preact-redux';
import { IState } from '../../data';
import { SendPage } from './send.component';
import { BLOCKCHAIN_INFO } from '../../utils/blockchain/blockchain-info';
import { createTransfer } from '../../data/wallet/actions';
import { getWalletProvider } from '../../app-context';
const mapStateToProps = (state: IState, ownProps) => {
    const { blockchain, address } = ownProps;

    let account;
    if (state.wallet.data.accounts[blockchain]) {
        account = state.wallet.data.accounts[blockchain].filter(acc => acc.address === address)[0];
    }

    return {
        blockchain: account.node.blockchain,
        blockchainInfo: BLOCKCHAIN_INFO[account.node.blockchain],
        account,
        transferInfo: state.wallet.transfer || {}
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
