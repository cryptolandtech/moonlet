import { connect } from 'preact-redux';
import App from './app.component';
import { createChangePage, createChangeScreenSize } from './data/page-config/actions';
import { IState } from './data/';

const mapStateToProps = (state: IState, ownProps) => {
    return {
        ...ownProps,
        walletLoaded: state.wallet.loaded,
        walletLoadingInProgress: state.wallet.loadingInProgress,
        walletLocked: state.wallet.locked
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
