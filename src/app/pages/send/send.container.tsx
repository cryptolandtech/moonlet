import { connect } from 'preact-redux';
import { IState } from '../../data';
import { SendPage } from './send.component';
import { BLOCKCHAIN_INFO } from '../../utils/blockchain/blockchain-info';
import { createTransfer } from '../../data/wallet/actions';
import { getWalletProvider } from '../../app-context';
import { getAccountFromState } from '../../utils/blockchain/utils';
const mapStateToProps = (state: IState, ownProps) => {
    const { blockchain, address } = ownProps;

    const account = getAccountFromState(state, blockchain, address);

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
