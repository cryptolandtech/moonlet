import { connect } from 'preact-redux';
import App from './app.component';
import { createChangePage, createChangeScreenSize } from './data/page-config/actions';

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = {
    onScreenSizeChange: createChangeScreenSize,
    onRouteChange: createChangePage
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
