import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import { BLOCKCHAIN_INFO } from '../../../../utils/blockchain/blockchain-info';

import './account-card.scss';
import Currency from '../../../../components/currency/currency.container';

interface IProps {
    account: any;
}

export class AccountCard extends Component<IProps> {
    public render() {
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
                    <div class="account-name">Account 1</div>
                </div>
                <div class="account-balance">
                    <Currency
                        amount={Math.random()}
                        currency={BLOCKCHAIN_INFO[this.props.account.node.blockchain].coin}
                    />
                </div>
                <div class="account-balance-fiat center-text">
                    ~{' '}
                    <Currency
                        amount={Math.random()}
                        currency={BLOCKCHAIN_INFO[this.props.account.node.blockchain].coin}
                        convert
                    />
                </div>
            </Card>
        );
    }
}
