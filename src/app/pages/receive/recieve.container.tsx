import { connect } from 'preact-redux';
import { IState } from '../../data';
import { ReceivePage } from './receive.component';

const mapStateToProps = (state: IState) => {
    return {
        account:
            state.wallet.data.accounts[state.wallet.selectedBlockchain][
                state.wallet.selectedAccount
            ]
    };
};

export default connect(mapStateToProps)(ReceivePage);
