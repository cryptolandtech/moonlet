import { connect } from 'preact-redux';
import { DefaultLayout } from './default.component';

const mapStateToProps = state => {
  return {
    layout: state.pageConfig.layout
  };
};

export default connect(mapStateToProps)(DefaultLayout);
