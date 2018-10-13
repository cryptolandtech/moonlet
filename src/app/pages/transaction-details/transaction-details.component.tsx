import { h, Component } from 'preact';
import List from 'preact-material-components/List';
import { translate } from '../../utils/translate';
import { ListItem } from '../../components/list-item/list-item.component';
import { getWallet } from '../../utils/wallet';
import { GenericTransaction } from 'moonlet-core/src/core/transaction';

interface ITransactionListItem {
    icon: string;
    primaryText: string;
    secondaryText: string;
    href?: string;
    target?: string;
}

interface IProps {
    transaction: GenericTransaction;
}

export class TransactionDetailsPage extends Component<IProps> {
    public getTransactionDetails(): ITransactionListItem[] {
        const tx = this.props.transaction;

        const details: ITransactionListItem[] = [];

        // date and time
        details.push({
            icon: 'history',
            primaryText: '05/07/2018 4:23:38 PM',
            secondaryText: translate('TransactionDetailsPage.dateTime')
        });

        // amount
        details.push({
            icon: 'attach_money',
            primaryText: (tx as any).value || (tx as any).amount,
            secondaryText: translate('TransactionDetailsPage.amount')
        });

        // fees
        // details.push({
        //     icon: 'attach_money',
        //     primaryText: 'ZIL 0.00001000',
        //     secondaryText: translate('TransactionDetailsPage.fees')
        // });

        // transaction status
        details.push({
            icon: 'access_time',
            primaryText: tx.status,
            secondaryText: translate('TransactionDetailsPage.status')
        });

        // from address
        details.push({
            icon: 'person_outline',
            primaryText: tx.from,
            secondaryText: translate('TransactionDetailsPage.from')
        });

        // to address
        details.push({
            icon: 'person',
            primaryText: tx.to,
            secondaryText: translate('TransactionDetailsPage.recipient')
        });

        // transaction id
        details.push({
            icon: 'crop',
            primaryText: tx.txn,
            secondaryText: translate('TransactionDetailsPage.id')
            // href:
            //     'https://explorer-scilla.zilliqa.com/transactions/5DF6E0E2761359D30A8275058E299FCC0381534545F55CF43E41983F5D4C9456',
            // target: '_blank'
        });

        return details;
    }

    public render() {
        return (
            <List className="transaction-details-page" two-line={true}>
                {this.getTransactionDetails().map(item => {
                    return [
                        <ListItem
                            icon={item.icon}
                            primaryText={item.primaryText}
                            secondaryText={item.secondaryText}
                            href={item.href}
                            target={item.target}
                        />
                    ];
                })}
            </List>
        );
    }
}
