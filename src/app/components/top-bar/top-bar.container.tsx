import {connect} from "preact-redux";
import { TopBar } from "./top-bar.component";
import { IState } from "../../data";

const mapStateToProps = (state: IState) => {
    return {
        config: state.pageConfig.layout.topBar,
        screenSize: state.pageConfig.device.screenSize
    }
};

export default connect(
    mapStateToProps
)(TopBar)