import { connect } from 'preact-redux';
import { Balance } from './balance.component';
import { IState } from '../../data';
import { createGetBalance } from '../../data/wallet/actions';
import { getWalletPlugin } from '../../app-context';

const mapStateToProps = (state: IState, ownProps) => {
    return {
        ...ownProps,
        balances: state.wallet.balances || {}
    };
};

const mapDispatchToProps = {
    updateBalance: (blockchain, address) => createGetBalance(getWalletPlugin(), blockchain, address)
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Balance);
