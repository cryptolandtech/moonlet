import { connect } from 'preact-redux';
import { IState } from '../../data';
import { getWallet } from '../../utils/wallet';
import { SendPage } from './send.component';
import { BLOCKCHAIN_INFO } from '../../utils/blockchain/blockchain-info';

const mapStateToProps = (state: IState) => {
    return {
        blockchain: state.wallet.selectedBlockchain,
        blockchainInfo: BLOCKCHAIN_INFO[state.wallet.selectedBlockchain],
        account: getWallet().getAccounts(state.wallet.selectedBlockchain)[
            state.wallet.selectedAccount
        ]
    };
};

export default connect(mapStateToProps)(SendPage);
