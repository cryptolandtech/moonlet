import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import { BLOCKCHAIN_INFO } from '../../../../utils/blockchain/blockchain-info';

import './account-card.scss';
import Currency from '../../../../components/currency/currency.container';
import Balance from '../../../../components/balance/balance.container';
import { GenericAccount, AccountType } from 'moonlet-core/src/core/account';
import { Copy } from '../../../../components/copy/copy.component';
import Typography from 'preact-material-components/Typography';

interface IProps {
    account: GenericAccount;
    showAddress?: boolean;
}

export class AccountCard extends Component<IProps> {
    public render() {
        let accountTypeIcon;
        const address = this.props.account.address || '';
        switch (this.props.account.type) {
            case AccountType.HD:
                accountTypeIcon = '/assets/planet.svg';
                break;
            case AccountType.LOOSE:
                accountTypeIcon = '/assets/import.svg';
                break;
        }

        return (
            <Card className="account-card">
                <div class="account-card-inner">
                    <div class="blockchain-logo">
                        <img
                            src={`/assets/token-logos/${
                                BLOCKCHAIN_INFO[this.props.account.node.blockchain].coin
                            }.svg`}
                        />
                    </div>
                    <div class="account-name">{this.props.account.name}</div>
                    <div class="account-type">
                        <img
                            src={`/assets/icons/account-type-${this.props.account.type.toLowerCase()}.svg`}
                        />
                    </div>
                </div>

                {this.props.showAddress && (
                    <Typography headline6 class="center-text">
                        {address.substr(0, 7)}...{address.substr(-5)}
                    </Typography>
                )}

                <div class="account-balance">
                    <Balance
                        blockchain={this.props.account.node.blockchain}
                        address={this.props.account.address}
                    />
                </div>
                <div class="account-balance-fiat center-text">
                    ~{' '}
                    <Balance
                        blockchain={this.props.account.node.blockchain}
                        address={this.props.account.address}
                        convert
                    />
                </div>
            </Card>
        );
    }
}
