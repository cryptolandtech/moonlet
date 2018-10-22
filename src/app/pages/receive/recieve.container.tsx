import { connect } from 'preact-redux';
import { IState } from '../../data';
import { getWallet } from '../../utils/wallet';
import { ReceivePage } from './receive.component';

const mapStateToProps = (state: IState) => {
    return {
        account: getWallet().getAccounts(state.wallet.selectedBlockchain)[
            state.wallet.selectedAccount
        ]
    };
};

export default connect(mapStateToProps)(ReceivePage);
