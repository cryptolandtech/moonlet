import { connect } from 'preact-redux';
import { RevealPage } from './reveal.component';
import { getAccountFromState } from '../../../utils/blockchain/utils';

const mapStateToProps = (state, ownProps) => {
    const { type, blockchain, address } = ownProps;

    const account = getAccountFromState(state, blockchain, address);

    return {
        account,
        type,
        words: state.wallet.data.mnemonics.split(' ')
    };
};

export default connect(mapStateToProps)(RevealPage);
