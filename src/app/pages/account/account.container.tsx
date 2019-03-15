import { connect } from 'preact-redux';
import { AccountPage } from './account.component';
import { IState } from '../../data';
import { getAccountFromState } from '../../utils/blockchain/utils';

const mapStateToProps = (state: IState, ownProps) => {
    const { blockchain, address } = ownProps;

    const account = getAccountFromState(state, blockchain, address);

    return {
        account,
        device: state.pageConfig.device
    };
};

export default connect(mapStateToProps)(AccountPage);
