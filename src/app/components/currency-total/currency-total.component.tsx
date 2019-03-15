import { h, Component } from 'preact';
import { ICurrency } from '../../data/currency/state';

interface IProps {
    amounts: Array<{ amount: number; coin: string }>;
    hideCurrency: boolean;

    conversionRates: ICurrency;
    preferredCurrency: string;
}

export class CurrencyTotal extends Component<IProps> {
    public render() {
        let loading = false;
        const currency = this.props.preferredCurrency;
        let amount = 0;

        if (this.props.conversionRates) {
            this.props.amounts.map(balance => {
                if (
                    typeof balance.amount === 'number' &&
                    balance.amount >= 0 &&
                    this.props.conversionRates[balance.coin] &&
                    this.props.conversionRates[balance.coin][this.props.preferredCurrency]
                ) {
                    amount +=
                        balance.amount *
                        this.props.conversionRates[balance.coin][this.props.preferredCurrency];
                } else {
                    loading = true;
                }
            });
        } else {
            loading = true;
        }

        return (
            <span class="currency">
                {loading && '...'}
                {!loading && <span>{amount.toFixed(2)}</span>}{' '}
                {!loading && !this.props.hideCurrency && <span>{currency}</span>}
            </span>
        );
    }
}
