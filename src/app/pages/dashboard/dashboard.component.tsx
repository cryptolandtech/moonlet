import { Component, h } from 'preact';

import Card from 'preact-material-components/Card';
import './dashboard.scss';

import { BLOCKCHAIN_INFO } from '../../../utils/blockchain/blockchain-info';
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
import Dialog from 'preact-material-components/Dialog';
import { getAccountIcon } from '../../utils/account';
interface IProps {
    hideTestNetWarning: boolean;
    accounts: GenericAccount[];
    balances: IAccountsBalances;
    selectedAccount?: { blockchain: Blockchain; address: string };
    device: IDevice;
    userPreferences: IUserPreferences;
    oldAccountWarning: boolean;

    updateBalance: (blockchain: Blockchain, address: string) => any;
    dismissXSell: () => any;
    showOldAccountWarning: (show: boolean) => any;
}

export class DashboardPage extends Component<IProps> {
    public oldAccountWarningDialog;

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

    public componentDidUpdate(prevProps: IProps) {
        if (
            this.props.oldAccountWarning !== prevProps.oldAccountWarning &&
            this.props.oldAccountWarning
        ) {
            this.oldAccountWarningDialog.MDComponent.show();
        }
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
                        <img class="account-type" src={getAccountIcon(account)} />
                    </Card>
                ))}
                <Link class="create-account" href="/create-account">
                    <Icon>add_circle_outline</Icon>
                    <div>
                        <Translate text="DashboardPage.menu.addNewAccount" />
                    </div>
                </Link>

                <Dialog
                    ref={ref => (this.oldAccountWarningDialog = ref)}
                    onAccept={() => {
                        setTimeout(() => route('/settings/zilliqa-account-recover'), 50);
                        this.props.showOldAccountWarning(false);
                    }}
                    onCancel={() => {
                        this.props.showOldAccountWarning(false);
                    }}
                >
                    <Dialog.Header>
                        <Translate text="App.labels.alert" />
                    </Dialog.Header>
                    <Dialog.Body>
                        It seems that you generated your wallet with an older version of Moonlet,
                        used for testing purposes. You might not be able to see your account
                        anymore.
                        <br />
                        You can get your account on Settings -> Developer Options -> Wallets older
                        than 0.3.111 version.
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.FooterButton cancel={true}>
                            {translate('App.labels.dismiss')}
                        </Dialog.FooterButton>
                        <Dialog.FooterButton accept={true}>Go Now</Dialog.FooterButton>
                    </Dialog.Footer>
                </Dialog>
            </div>
        );
    }
}
