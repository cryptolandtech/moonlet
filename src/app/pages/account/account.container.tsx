import { connect } from 'preact-redux';
import { AccountPage } from './account.component';
import { IState } from '../../data';
import { getAccountFromState, filterAccounts } from '../../../utils/blockchain/utils';

const mapStateToProps = (state: IState, ownProps) => {
    const { blockchain, address } = ownProps;
    const accounts = filterAccounts(
        state.wallet.data || {},
        !state.userPreferences.testNet,
        state.userPreferences.networks
    );

    const account = getAccountFromState(state, blockchain, address);

    return {
        accounts,
        account,
        device: state.pageConfig.device
    };
};

export default connect(mapStateToProps)(AccountPage);
