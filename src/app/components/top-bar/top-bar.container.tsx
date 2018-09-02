import { connect } from 'preact-redux';
import { IState } from '../../data';
import { TopBar } from './top-bar.component';

const mapStateToProps = (state: IState) => {
  return {
    config: state.pageConfig.layout.topBar,
    screenSize: state.pageConfig.device.screenSize
  };
};

export default connect(mapStateToProps)(TopBar);
