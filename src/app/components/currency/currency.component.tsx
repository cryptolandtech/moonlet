import { h, Component } from 'preact';
import { ICurrency } from '../../data/currency/state';

interface IProps {
    amount: number;
    currency: string;
    convert: boolean;
    hideCurrency: boolean;

    conversionRates: ICurrency;
    preferredCurrency: string;
}

export class Currency extends Component<IProps> {
    public render() {
        let { amount, currency } = this.props;
        let loading = false;

        if (
            this.props.convert &&
            this.props.conversionRates &&
            this.props.conversionRates[this.props.currency]
        ) {
            currency = this.props.preferredCurrency;
            amount =
                amount *
                this.props.conversionRates[this.props.currency][this.props.preferredCurrency];
        } else if (this.props.convert) {
            loading = true;
        }

        return (
            <span class="currency">
                {loading && '...'}
                {!loading && <span>{this.props.convert ? amount.toFixed(2) : amount}</span>}{' '}
                {!loading && !this.props.hideCurrency && <span>{currency}</span>}
            </span>
        );
    }
}
