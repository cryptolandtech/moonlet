import { connect } from 'preact-redux';
import { TransactionDetailsPage } from './transaction-details.component';
import { GenericAccount } from 'moonlet-core/src/core/account';
import { GenericTransaction } from 'moonlet-core/src/core/transaction';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IState } from '../../data';
import { BLOCKCHAIN_INFO } from '../../utils/blockchain/blockchain-info';

const mapStateToProps = (state: IState, ownProps) => {
    const wallet = state.wallet.data;
    const transactionId = ownProps.transactionId;
    let transaction;
    let txAccount;
    let txBlockchain;

    Object.keys(wallet.accounts).forEach((blockchain: Blockchain) => {
        const blockchainAccounts: GenericAccount[] = wallet.accounts[blockchain];
        blockchainAccounts.forEach((account: GenericAccount) => {
            (account as any).transactions.forEach((tx: GenericTransaction) => {
                if (
                    tx.txn === transactionId ||
                    ((tx.txn as any).TranID && (tx.txn as any).TranID === transactionId)
                ) {
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
        blockchain: txBlockchain,
        blockchainInfo: BLOCKCHAIN_INFO[state.wallet.selectedBlockchain]
    };
};

export default connect(mapStateToProps)(TransactionDetailsPage);
