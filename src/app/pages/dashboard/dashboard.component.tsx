import { Component, h } from 'preact';

import Card from 'preact-material-components/Card';
import './dashboard.scss';

import { BLOCKCHAIN_INFO } from '../../utils/blockchain/blockchain-info';
import { Blockchain } from 'moonlet-core/src/core/blockchain';

import { IAccountsBalances, IAccountBalance } from '../../data/wallet/state';
import { route } from 'preact-router';
import { IDevice } from '../../data/page-config/state';
import Balance from '../../components/balance/balance.container';
import CurrencyTotal from '../../components/currency-total/currency-total.container';

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
        let balance = { loading: false, amount: undefined, lastUpdate: undefined };
        if (this.props.balances[account.node.blockchain]) {
            balance = this.props.balances[account.node.blockchain][account.address] || balance;
        }
        return balance;
    }

    public render() {
        return (
            <div className="dashboard-page">
                <div class="total-balance">
                    <CurrencyTotal
                        amounts={this.props.accounts.map(acc => {
                            const amount = this.props.balances[acc.node.blockchain]
                                ? parseFloat(
                                      this.props.balances[acc.node.blockchain][
                                          acc.address
                                      ].amount.toString()
                                  )
                                : undefined;
                            const coin = BLOCKCHAIN_INFO[acc.node.blockchain].coin;
                            return { amount, coin };
                        })}
                    />
                </div>
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
                                    <Balance
                                        blockchain={account.node.blockchain}
                                        address={account.address}
                                        hideCurrency
                                    />
                                </div>
                                <div class="wallet-name">
                                    {account.name} ~{' '}
                                    <Balance
                                        blockchain={account.node.blockchain}
                                        address={account.address}
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
