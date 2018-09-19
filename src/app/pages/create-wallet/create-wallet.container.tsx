import { connect } from 'preact-redux';
import { CreateWalletPage } from './create-wallet.component';

const mapStateToProps = state => {
    return {
        platform: state.pageConfig.device.platform
    };
};

export default connect(mapStateToProps)(CreateWalletPage);
