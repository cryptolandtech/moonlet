import { Component, h } from 'preact';

import Card from 'preact-material-components/Card';
import './dashboard.scss';

import { BLOCKCHAIN_INFO } from '../../utils/blockchain/blockchain-info';
import { Blockchain } from 'moonlet-core/src/core/blockchain';

import { IAccountsBalances, IAccountBalance } from '../../data/wallet/state';
import { route, Link } from 'preact-router';
import { IDevice } from '../../data/page-config/state';
import Balance from '../../components/balance/balance.container';
import TestnetWarning from '../../components/testnet-warning/testnet-warning.container';
import { GenericAccount } from 'moonlet-core/src/core/account';
import Icon from 'preact-material-components/Icon';
import { Translate } from '../../components/translate/translate.component';
import { IUserPreferences } from '../../data/user-preferences/state';
import Button from 'preact-material-components/Button';
import { translate } from '../../utils/translate';
interface IProps {
    hideTestNetWarning: boolean;
    accounts: GenericAccount[];
    balances: IAccountsBalances;
    selectedAccount?: { blockchain: Blockchain; address: string };
    device: IDevice;
    userPreferences: IUserPreferences;

    updateBalance: (blockchain: Blockchain, address: string) => any;
    dismissXSell: () => any;
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

    public shouldDisplayXSell() {
        const today = new Date().toDateString();
        const lastDismiss = new Date(
            this.props.userPreferences.xsellDashboardLastDismiss
        ).toDateString();
        return today !== lastDismiss;
    }

    public render() {
        return (
            <div className="dashboard-page">
                {!this.props.hideTestNetWarning && <TestnetWarning />}
                {this.shouldDisplayXSell() && (
                    <Card className="xsell-card">
                        <Translate text="DashboardPage.xSell.text" />
                        <div class="action-buttons">
                            <Button onClick={() => setTimeout(() => this.props.dismissXSell(), 50)}>
                                {translate('App.labels.dismiss')}
                            </Button>
                            <Button
                                raised
                                secondary
                                href="https://moonlet.xyz/links/ud"
                                target="_blank"
                            >
                                {translate('DashboardPage.xSell.getOneNow')}
                            </Button>
                        </div>
                    </Card>
                )}
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
                        <img
                            class="account-type"
                            src={`/assets/icons/account-type-${account.type.toLowerCase()}.svg`}
                        />
                    </Card>
                ))}
                <Link class="create-account" href="/create-account">
                    <Icon>add_circle_outline</Icon>
                    <div>
                        <Translate text="DashboardPage.menu.addNewAccount" />
                    </div>
                </Link>
            </div>
        );
    }
}
