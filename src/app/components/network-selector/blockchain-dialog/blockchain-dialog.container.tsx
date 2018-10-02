import { connect } from 'preact-redux';

import { NetworkSelectorBlockChainDialog } from './blockchain-dialog.component';
import { IState } from '../../../data';
import { getWallet } from '../../../utils/wallet';

const mapStateToProps = (state: IState, ownProps) => {
    return {
        ...ownProps,
        wallet: getWallet()
    };
};

export default connect(
    mapStateToProps,
    null,
    null,
    { withRef: true }
)(NetworkSelectorBlockChainDialog);
