import { Component, h } from 'preact';

import Card from 'preact-material-components/Card';
import Icon from 'preact-material-components/Icon';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import './dashboard.scss';
import List from 'preact-material-components/List';
import Elevation from 'preact-material-components/Elevation';
import { Translate } from '../../components/translate/translate.component';
import { TextareaAutoSize } from '../../components/textarea-auto-size/textarea-auto-size.components';
import { BLOCKCHAIN_INFO, IBlockchainInfo } from '../../utils/blockchain/blockchain-info';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { BigNumber } from 'bignumber.js';
import { IAccountsBalances, IAccountBalance } from '../../data/wallet/state';
import { convertUnit } from '../../utils/blockchain/utils';
import { route } from 'preact-router';
import { IDevice } from '../../data/page-config/state';
import { DeviceScreenSize } from '../../types';

interface IProps {
    accounts: any[];
    balances: IAccountsBalances;
    selectedAccount?: { blockchain: Blockchain; address: string };
    device: IDevice;

    updateBalance: (blockchain: Blockchain, address: string) => any;
}

export class DashboardPage extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

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
                                    {this.getBalance(account).amount ||
                                        Math.random()
                                            .toString()
                                            .substr(0, 6)}
                                </div>
                                <div class="wallet-name">Account 1</div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }
}
