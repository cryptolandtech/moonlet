import App from "./app.component";
import { connect } from "preact-redux";
import { createChangeScreenSize, createChangePage } from "./data/page-config/actions";

const mapStateToProps = (state) => {
    return {};
}

const mapDispatchToProps = {
    onScreenSizeChange: createChangeScreenSize,
    onRouteChange: createChangePage
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
