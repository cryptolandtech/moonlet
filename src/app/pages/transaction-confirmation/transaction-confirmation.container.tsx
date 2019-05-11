import { connect } from 'preact-redux';
import { IState } from '../../data';

import { TransactionConfirmationPage } from './transaction-confirmation.component';
import { createTransfer } from '../../data/wallet/actions';
import { getWalletPlugin } from '../../app-context';

const mapStateToProps = (state: IState) => {
    return {
        transferInfo: state.wallet.transfer || {}
    };
};

const mapDispatchToProps = {
    transfer: (blockchain, fromAddress, toAddress, amount, feeOptions) =>
        createTransfer(getWalletPlugin(), blockchain, fromAddress, toAddress, amount, feeOptions)
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionConfirmationPage);
