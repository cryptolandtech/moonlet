import { connect } from 'preact-redux';
import { IState } from '../../data/index';
import { ConfirmationScreenPage } from './confirmation-screen.component';

const mapStateToProps = (state: IState) => {
    return {
        confirmationScreen: state.pageConfig.confirmationScreen
    };
};

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConfirmationScreenPage);
