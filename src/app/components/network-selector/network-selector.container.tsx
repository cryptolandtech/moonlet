import { connect } from 'preact-redux';
import { NetworkSelector } from './network-selector.component';
import { IState } from '../../data';
import { createChangeNetwork } from '../../data/wallet/actions';

const mapStateToProps = (state: IState) => {
    return {
        blockchain: state.wallet.selectedBlockchain
    };
};

const mapDispatchToProps = {
    onBlockchainChange: createChangeNetwork
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NetworkSelector);
