import { connect } from 'preact-redux';
import { GasFee } from './gas-fee.component';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps
    };
};

export default connect(mapStateToProps)(GasFee);
