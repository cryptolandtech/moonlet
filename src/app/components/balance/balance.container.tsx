import { connect } from 'preact-redux';
import { Balance } from './balance.component';
import { IState } from '../../data';
import { createGetBalance } from '../../data/wallet/actions';
import { getWalletProvider } from '../../app-context';

const mapStateToProps = (state: IState, ownProps) => {
    return {
        ...ownProps,
        balances: state.wallet.balances || {}
    };
};

const mapDispatchToProps = {
    updateBalance: (blockchain, address) =>
        createGetBalance(getWalletProvider(), blockchain, address)
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Balance);
