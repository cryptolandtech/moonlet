import { connect } from 'preact-redux';
import { ImportWalletCloudRestore } from './cloud-restore.component';
import { createWalletSync } from '../../../data/wallet/actions';
import { getWalletProvider } from '../../../app-context';

const mapStateToProps = (state, ownProps) => {
    return ownProps;
};

const mapDispatchToProps = {
    syncWallet: () => createWalletSync(getWalletProvider())
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImportWalletCloudRestore);
