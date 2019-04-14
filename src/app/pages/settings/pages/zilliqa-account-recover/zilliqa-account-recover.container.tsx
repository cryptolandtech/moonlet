import { connect } from 'preact-redux';
import { ZilliqaAccountRecover } from './zilliqa-account-recover.component';

import { getWalletProvider } from '../../../../app-context';
import { createWalletSync } from '../../../../data/wallet/actions';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps
    };
};

const mapDispatchToProps = {
    syncWallet: () => createWalletSync(getWalletProvider())
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ZilliqaAccountRecover);
