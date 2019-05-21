import { connect } from 'preact-redux';
import App from './app.component';
import { createChangePage, createChangeScreenSize } from './data/page-config/actions';
import { IState } from './data/';
import { filterAccounts } from '../utils/blockchain/utils';
import { getPlugins } from './app-context';
import { createUpdateConversionRates } from './data/currency/actions';

const mapStateToProps = (state: IState, ownProps) => {
    const accounts = filterAccounts(
        state.wallet.data || {},
        !(state.userPreferences || ({} as any)).testNet,
        (state.userPreferences || ({} as any)).networks
    );

    return {
        ...ownProps,
        accounts,
        walletStatus: state.wallet.status,
        app: state.app
    };
};

const mapDispatchToProps = {
    onScreenSizeChange: createChangeScreenSize,
    onRouteChange: createChangePage,
    updateExchangeRates: () => createUpdateConversionRates(getPlugins())
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
