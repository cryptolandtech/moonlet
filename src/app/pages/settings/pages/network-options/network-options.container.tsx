import { connect } from 'preact-redux';
import { NetworkOptionsPage } from './network-options.component';
import { IState } from '../../../../data';
import {
    createTestNetToggle,
    createSwitchNetwork
} from '../../../../data/user-preferences/actions';

const mapStateToProps = (state: IState, ownProps) => {
    return {
        ownProps,
        userPreferences: state.userPreferences
    };
};

const mapDispatchToProps = {
    toggleTestNet: createTestNetToggle,
    switchNetwork: createSwitchNetwork
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NetworkOptionsPage);
