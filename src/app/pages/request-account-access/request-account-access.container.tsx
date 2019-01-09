import { connect } from 'preact-redux';
import { IState } from '../../data';

import { RequestAccountAccessPage } from './request-account-access.component';

const mapStateToProps = (state: IState) => {
    return {
        wallet: state.wallet
    };
};

export default connect(mapStateToProps)(RequestAccountAccessPage);
