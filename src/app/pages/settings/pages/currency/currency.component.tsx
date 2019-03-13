import { h, Component } from 'preact';
import { AVAILABLE_CURRENCIES } from '../../../../utils/currency-conversion';
import List from 'preact-material-components/List';
import { IUserPreferences } from '../../../../data/user-preferences/state';

interface IProps {
    userPreferences: IUserPreferences;
    updatePreferredCurrency: (currency: string) => any;
}

export class CurrencyPage extends Component<IProps> {
    public render() {
        return (
            <div class="currency-page">
                <List>
                    {AVAILABLE_CURRENCIES.map(currency => [
                        <List.LinkItem
                            className="pointer"
                            onClick={() => this.props.updatePreferredCurrency(currency)}
                        >
                            <List.ItemGraphic
                                className={
                                    currency === this.props.userPreferences.preferredCurrency
                                        ? 'secondary-color'
                                        : ''
                                }
                            >
                                {currency === this.props.userPreferences.preferredCurrency
                                    ? 'check'
                                    : 'radio_button_unchecked'}
                            </List.ItemGraphic>
                            <List.TextContainer>{currency}</List.TextContainer>
                        </List.LinkItem>,
                        <List.Divider />
                    ])}
                </List>
            </div>
        );
    }
}
