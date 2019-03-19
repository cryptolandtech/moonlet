import { connect } from 'preact-redux';
import { TransactionFee } from './transaction-fee.component';
import { BLOCKCHAIN_INFO } from '../../../../utils/blockchain/blockchain-info';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps
    };
};

export default connect(mapStateToProps)(TransactionFee);
