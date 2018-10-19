import { connect } from 'preact-redux';
import { RevealPage } from './reveal.component';
import { getWallet } from '../../utils/wallet';

const mapStateToProps = (state, ownProps) => {
    return {
        account: getWallet().getAccounts(state.wallet.selectedBlockchain)[
            state.wallet.selectedAccount
        ],
        words: getWallet().mnemonics.split(' '),
        routeName: ownProps.name
    };
};

export default connect(mapStateToProps)(RevealPage);
