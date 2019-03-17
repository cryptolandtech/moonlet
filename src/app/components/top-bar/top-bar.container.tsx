import { connect } from 'preact-redux';
import { TopBar } from './top-bar.component';
import { IState } from '../../data';
import { filterAccounts } from '../../utils/blockchain/utils';

const mapStateToProps = (state: IState) => {
    const accounts = filterAccounts(
        state.wallet.data || {},
        !state.userPreferences.testNet,
        state.userPreferences.networks
    );
    const balances = state.wallet.balances || {};

    return {
        config: state.pageConfig.layout.topBar,
        screenSize: state.pageConfig.device.screenSize,
        accounts,
        balances
    };
};

export default connect(mapStateToProps)(TopBar);
