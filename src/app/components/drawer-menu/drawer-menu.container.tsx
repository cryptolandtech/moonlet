import { connect } from 'preact-redux';
import { createSignOut } from '../../data/wallet/actions';
import { DrawerMenu } from './drawer-menu.component';

const mapDispatchToProps = {
    signOut: createSignOut
};

export default connect(
    (state, ownProps) => ownProps,
    mapDispatchToProps
)(DrawerMenu);
