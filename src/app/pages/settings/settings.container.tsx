import { connect } from 'preact-redux';
import { SettingsPage } from './settings.component';
import { createSignOut } from '../../data/wallet/actions';
import { IState } from '../../data/index';
import { createDevModeToggle } from '../../data/user-preferences/actions';
import { getWalletPlugin } from '../../app-context';

const mapStateToProps = (state: IState, ownProps) => {
    return {
        ownProps,
        version: state.extension ? state.extension.version : '',
        userPreferences: state.userPreferences
    };
};

const mapDispatchToProps = {
    signOut: createSignOut,
    toggleDevMode: (devMode, testNet, networks) =>
        createDevModeToggle(getWalletPlugin(), devMode, testNet, networks)
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsPage);
