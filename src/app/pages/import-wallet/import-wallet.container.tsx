import { connect } from 'preact-redux';
import { createWallet } from '../../data/wallet/actions';
import { ImportWalletPage } from './import-wallet.component';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        platform: state.pageConfig.device.platform
    };
};

const mapDispatchToProps = {
    createWallet
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImportWalletPage);
