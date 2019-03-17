import { connect } from 'preact-redux';
import { IState } from '../../data';
import { TestnetWarning } from './testnet-warning.component';

const mapStateToProps = (state: IState, ownProps) => {
    return {
        ...ownProps,
        testNet: state.userPreferences.testNet
    };
};

export default connect(mapStateToProps)(TestnetWarning);
