import { connect } from 'preact-redux';
import { SettingsPage } from './settings.component';
import { createSignOut } from '../../data/wallet/actions';

const mapDispatchToProps = {
    signOut: createSignOut
};

export default connect(
    () => ({}),
    mapDispatchToProps
)(SettingsPage);
