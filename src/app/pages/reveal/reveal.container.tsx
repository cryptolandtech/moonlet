import { connect } from 'preact-redux';
import { RevealPage } from './reveal.component';

const mapStateToProps = (state, ownProps) => {
    return {
        account:
            state.wallet.data.accounts[state.wallet.selectedBlockchain][
                state.wallet.selectedAccount
            ],
        words: state.wallet.data.mnemonics.split(' '),
        routeName: ownProps.name
    };
};

export default connect(mapStateToProps)(RevealPage);
