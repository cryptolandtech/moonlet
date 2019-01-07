import { connect } from 'preact-redux';

import { NetworkSelectorBlockChainDialog } from './blockchain-dialog.component';
import { IState } from '../../../data';

const mapStateToProps = (state: IState, ownProps) => {
    return {
        ...ownProps,
        wallet: state.wallet.data
    };
};

export default connect(
    mapStateToProps,
    null,
    null,
    { withRef: true }
)(NetworkSelectorBlockChainDialog);
