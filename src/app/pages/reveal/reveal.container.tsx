import { connect } from 'preact-redux';
import { RevealPage } from './reveal.component';

const mapStateToProps = (state, ownProps) => {
    const { type, blockchain, address } = ownProps;

    let account;
    if (state.wallet.data.accounts[blockchain]) {
        account = state.wallet.data.accounts[blockchain].filter(acc => acc.address === address)[0];
    }

    return {
        account,
        type,
        words: state.wallet.data.mnemonics.split(' ')
    };
};

export default connect(mapStateToProps)(RevealPage);
