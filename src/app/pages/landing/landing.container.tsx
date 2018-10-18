import { connect } from 'preact-redux';
import { IState } from '../../data/index';
import { LandingPage } from './landing.component';
import { createLoadWallet } from '../../data/wallet/actions';

const mapStateToProps = (state: IState) => {
    return {
        wallet: state.wallet
    };
};

const mapDispatchToProps = {
    loadWallet: createLoadWallet
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LandingPage);
