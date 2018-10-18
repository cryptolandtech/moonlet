import { connect } from 'preact-redux';
import { createWalletLoaded } from '../../data/wallet/actions';
import { CreateWalletPage } from './create-wallet.component';

const mapStateToProps = state => {
    return {
        platform: state.pageConfig.device.platform
    };
};

const mapDispatchToProps = {
    loadWallet: createWalletLoaded
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateWalletPage);
