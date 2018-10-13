import { connect } from 'preact-redux';
import { TransactionDetailsPage } from './transaction-details.component';
import { getWallet } from '../../utils/wallet';
import { GenericAccount } from 'moonlet-core/src/core/account';
import { GenericTransaction } from 'moonlet-core/src/core/transaction';

const mapStateToProps = (state, ownProps) => {
    const wallet = getWallet();
    const transactionId = ownProps.transactionId;
    let transaction;

    wallet.accounts.forEach((blockchainAccounts: GenericAccount[]) => {
        blockchainAccounts.forEach((account: GenericAccount) => {
            account.getTransactions().forEach((tx: GenericTransaction) => {
                if (tx.txn === transactionId) {
                    transaction = tx;
                }
            });
        });
    });

    return {
        ...ownProps,
        transaction
    };
};

export default connect(mapStateToProps)(TransactionDetailsPage);
