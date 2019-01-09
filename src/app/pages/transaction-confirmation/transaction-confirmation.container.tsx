import { connect } from 'preact-redux';
import { IState } from '../../data';

import { TransactionConfirmationPage } from './transaction-confirmation.component';
import { BLOCKCHAIN_INFO } from '../../utils/blockchain/blockchain-info';
import { createTransfer } from '../../data/wallet/actions';
import { getWalletProvider } from '../../app-context';

const mapStateToProps = (state: IState) => {
    return {
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
)(TransactionConfirmationPage);
