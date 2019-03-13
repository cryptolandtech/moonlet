import { connect } from 'preact-redux';
import { CurrencyPage } from './currency.component';
import { IState } from '../../../../data';
import { createChangePreferredCurrency } from '../../../../data/user-preferences/actions';

const mapStateToProps = (state: IState, ownProps) => {
    return {
        ownProps,
        userPreferences: state.userPreferences
    };
};

const mapDispatchToProps = {
    updatePreferredCurrency: createChangePreferredCurrency
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CurrencyPage);
