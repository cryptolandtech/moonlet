import { connect } from 'preact-redux';
import { AccountPage } from './account.component';
import { IState } from '../../data';

const mapStateToProps = (state: IState, ownProps) => {
    const { blockchain, address } = ownProps;

    let account;
    if (state.wallet.data.accounts[blockchain]) {
        account = state.wallet.data.accounts[blockchain].filter(acc => acc.address === address)[0];
    }

    return {
        account,
        device: state.pageConfig.device
    };
};

export default connect(mapStateToProps)(AccountPage);
