import { connect } from 'preact-redux';
import { DefaultLayout } from './default.component';

const mapStateToProps = state => {
  return {
    layout: state.pageConfig.layout,
    device: state.pageConfig.device
  };
};

export default connect(mapStateToProps)(DefaultLayout);
