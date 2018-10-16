import { connect } from 'preact-redux';
import { RevealPage } from './reveal.component';
import { getWallet } from '../../utils/wallet';

const mapStateToProps = state => {
    return {
        account: getWallet().getAccounts(state.wallet.selectedBlockchain)[
            state.wallet.selectedAccount
        ],
        words: getWallet().mnemonics.split(' '),
        topBarMiddleText: state.pageConfig.layout.topBar.middle.text
    };
};

export default connect(mapStateToProps)(RevealPage);
