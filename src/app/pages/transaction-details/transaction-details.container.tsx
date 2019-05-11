import { connect } from 'preact-redux';
import { TransactionDetailsPage } from './transaction-details.component';
import { IState } from '../../data';
import { BLOCKCHAIN_INFO } from '../../../utils/blockchain/blockchain-info';
import { getAccountFromState } from '../../../utils/blockchain/utils';

const mapStateToProps = (state: IState, ownProps) => {
    const { blockchain, address, transactionId } = ownProps;
    const account = getAccountFromState(state, blockchain, address);

    const transaction = account.transactions.filter(tx => tx.id === transactionId)[0];

    return {
        ...ownProps,
        transaction,
        account,
        blockchain,
        blockchainInfo: BLOCKCHAIN_INFO[blockchain]
    };
};

export default connect(mapStateToProps)(TransactionDetailsPage);
