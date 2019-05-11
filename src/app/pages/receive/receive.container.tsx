import { connect } from 'preact-redux';
import { IState } from '../../data';
import { ReceivePage } from './receive.component';
import { getAccountFromState } from '../../../utils/blockchain/utils';

const mapStateToProps = (state: IState, ownProps) => {
    const { blockchain, address } = ownProps;

    const account = getAccountFromState(state, blockchain, address);

    return {
        account
    };
};

export default connect(mapStateToProps)(ReceivePage);
