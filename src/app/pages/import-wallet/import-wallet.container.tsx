import { connect } from 'preact-redux';
import { createWalletLoaded } from '../../data/wallet/actions';
import { ImportWalletPage } from './import-wallet.component';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps
    };
};

const mapDispatchToProps = {
    loadWallet: createWalletLoaded
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImportWalletPage);
