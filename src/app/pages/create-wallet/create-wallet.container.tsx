import { connect } from 'preact-redux';
import { createWallet } from '../../data/wallet/actions';
import { CreateWalletPage } from './create-wallet.component';

const mapStateToProps = state => {
    return {
        platform: state.pageConfig.device.platform
    };
};

const mapDispatchToProps = {
    createWallet
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateWalletPage);
