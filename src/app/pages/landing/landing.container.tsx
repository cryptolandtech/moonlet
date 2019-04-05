import { connect } from 'preact-redux';
import { IState } from '../../data/index';
import { LandingPage } from './landing.component';
import { createLoadWallet } from '../../data/wallet/actions';
import { createAcceptDisclaimer } from '../../data/user-preferences/actions';
import { DisclaimerPage } from '../settings/pages/disclaimer/disclaimer.component';

const mapStateToProps = (state: IState) => {
    return {
        networkConfig: {
            testNet: (state.userPreferences || ({} as any)).testNet,
            networks: (state.userPreferences || ({} as any)).networks
        },
        wallet: state.wallet,
        disclaimerVersionAccepted: (state.userPreferences || ({} as any)).disclaimerVersionAccepted
    };
};

const mapDispatchToProps = {
    loadWallet: createLoadWallet,
    acceptDisclaimer: () => createAcceptDisclaimer(DisclaimerPage.version)
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LandingPage);
