import { connect } from 'preact-redux';
import { TransactionFee } from './transaction-fee.component';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps
    };
};

export default connect(mapStateToProps)(TransactionFee);
