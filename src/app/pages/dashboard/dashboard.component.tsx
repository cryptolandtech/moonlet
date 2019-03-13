import { Component, h } from 'preact';

import Card from 'preact-material-components/Card';
import './dashboard.scss';

import { BLOCKCHAIN_INFO } from '../../utils/blockchain/blockchain-info';
import { Blockchain } from 'moonlet-core/src/core/blockchain';

import { IAccountsBalances, IAccountBalance } from '../../data/wallet/state';
import Currency from '../../components/currency/currency.container';
import { route } from 'preact-router';
import { IDevice } from '../../data/page-config/state';

interface IProps {
    accounts: any[];
    balances: IAccountsBalances;
    selectedAccount?: { blockchain: Blockchain; address: string };
    device: IDevice;

    updateBalance: (blockchain: Blockchain, address: string) => any;
}

export class DashboardPage extends Component<IProps> {
    public getCoin(account) {
        return BLOCKCHAIN_INFO[account.node.blockchain].coin;
    }

    public getBalance(account): IAccountBalance {
        let balance = { loading: false, amount: undefined };
        if (this.props.balances[account.node.blockchain]) {
            balance = this.props.balances[account.node.blockchain][account.address] || balance;
        }
        return balance;
    }

    public render() {
        return (
            <div className="dashboard-page">
                {this.props.accounts.map(account => (
                    <Card
                        className={
                            this.props.selectedAccount &&
                            this.props.selectedAccount.blockchain === account.node.blockchain &&
                            this.props.selectedAccount.address === account.address
                                ? 'selected'
                                : ''
                        }
                        onClick={() =>
                            route(`/account/${account.node.blockchain}/${account.address}`)
                        }
                    >
                        <div style="display: flex">
                            <div class="coin-logo">
                                <img
                                    src={`/assets/token-logos/${this.getCoin(
                                        account
                                    ).toLowerCase()}.svg`}
                                    height="35"
                                />
                            </div>
                            <div class="coin-name">{this.getCoin(account)}</div>
                            <div class="balance">
                                <div class="native">
                                    <Currency
                                        amount={this.getBalance(account).amount || Math.random()}
                                        currency={this.getCoin(account)}
                                        hideCurrency
                                    />
                                </div>
                                <div class="wallet-name">
                                    Account 1 ~{' '}
                                    <Currency
                                        amount={this.getBalance(account).amount || Math.random()}
                                        currency={this.getCoin(account)}
                                        convert
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }
}
