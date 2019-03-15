import { connect } from 'preact-redux';
import { CurrencyTotal } from './currency-total.component';
import { IState } from '../../data';

const mapStateToProps = (state: IState, ownProps) => {
    return {
        ...ownProps,
        conversionRates: state.currency,
        preferredCurrency: state.userPreferences.preferredCurrency
    };
};

export default connect(mapStateToProps)(CurrencyTotal);
