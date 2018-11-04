import { connect } from 'preact-redux';
import { TransactionDetailsPage } from './transaction-details.component';
import { getWallet } from '../../utils/wallet';
import { GenericAccount } from 'moonlet-core/src/core/account';
import { GenericTransaction } from 'moonlet-core/src/core/transaction';
import { Blockchain } from 'moonlet-core/src/core/blockchain';

const mapStateToProps = (state, ownProps) => {
    const wallet = getWallet();
    const transactionId = ownProps.transactionId;
    let transaction;
    let txAccount;
    let txBlockchain;

    wallet.accounts.forEach((blockchainAccounts: GenericAccount[], blockchain: Blockchain) => {
        blockchainAccounts.forEach((account: GenericAccount) => {
            account.getTransactions().forEach((tx: GenericTransaction) => {
                if (tx.txn === transactionId) {
                    transaction = tx;
                    txAccount = account;
                    txBlockchain = blockchain;
                }
            });
        });
    });

    return {
        ...ownProps,
        transaction,
        account: txAccount,
        blockchain: txBlockchain
    };
};

export default connect(mapStateToProps)(TransactionDetailsPage);
