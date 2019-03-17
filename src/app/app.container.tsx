import { connect } from 'preact-redux';
import App from './app.component';
import { createChangePage, createChangeScreenSize } from './data/page-config/actions';
import { IState } from './data/';
import { filterAccounts } from './utils/blockchain/utils';

const mapStateToProps = (state: IState, ownProps) => {
    const accounts = filterAccounts(
        state.wallet.data || {},
        !(state.userPreferences || ({} as any)).testNet,
        (state.userPreferences || ({} as any)).networks
    );

    return {
        ...ownProps,
        accounts,
        walletStatus: state.wallet.status
    };
};

const mapDispatchToProps = {
    onScreenSizeChange: createChangeScreenSize,
    onRouteChange: createChangePage
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
