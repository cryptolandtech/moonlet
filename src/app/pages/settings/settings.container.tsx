import { connect } from 'preact-redux';
import { SettingsPage } from './settings.component';
import { createSignOut } from '../../data/wallet/actions';
import { IState } from '../../data/index';

const mapStateToProps = (state: IState) => {
    return {
        version: state.extension ? state.extension.version : ''
    };
};

const mapDispatchToProps = {
    signOut: createSignOut
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsPage);
