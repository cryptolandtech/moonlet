import { connect } from 'preact-redux';
import { IState } from '../../data';
import { SendPage } from './send.component';
import { BLOCKCHAIN_INFO } from '../../utils/blockchain/blockchain-info';
import { createTransfer } from '../../data/wallet/actions';
import { getWalletProvider } from '../../app-context';
const mapStateToProps = (state: IState) => {
    return {
        blockchain: state.wallet.selectedBlockchain,
        blockchainInfo: BLOCKCHAIN_INFO[state.wallet.selectedBlockchain],
        account:
            state.wallet.data.accounts[state.wallet.selectedBlockchain][
                state.wallet.selectedAccount
            ],
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
