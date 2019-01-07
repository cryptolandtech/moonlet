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
import { Typography } from 'preact-material-components/Typography';
import { BigNumber } from 'bignumber.js';
import { IAccountBalance } from '../../data/wallet/state';
import { convertUnit } from '../../utils/blockchain/utils';

interface IProps {
    account: any;
    blockchain: Blockchain;
    blockchainInfo: IBlockchainInfo;
    balance: IAccountBalance;

    updateBalance: (blockchain: Blockchain, address: string) => any;
}

export class DashboardPage extends Component<IProps, any> {
    private textareaElement: HTMLTextAreaElement;

    constructor(props: IProps) {
        super(props);
        this.updateBalance();
    }

    public componentDidUpdate(prevProps: IProps) {
        if (
            this.props.blockchain !== prevProps.blockchain ||
            this.props.account.address !== prevProps.account.address
        ) {
            this.updateBalance();
        }
    }

    public updateBalance() {
        this.props.updateBalance(this.props.blockchain, this.props.account.address);
    }

    public getCoin() {
        return BLOCKCHAIN_INFO[this.props.blockchain].coin;
    }

    public render() {
        return (
            <div className="dashboard-page">
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols={12}>
                            <Card className="card balance-card">
                                <p className="mdc-typography--body2">
                                    Your opinion is very important to us.{' '}
                                    <a
                                        href="https://goo.gl/forms/48aS7rKKOOkbFIhm1"
                                        target="_blank"
                                    >
                                        Leave feedback
                                    </a>
                                </p>
                            </Card>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell cols={4} tabletCols={8}>
                            <Card className="card balance-card">
                                <Translate text="DashboardPage.totalBalance" tag="p" body2 />
                                <p className="mdc-typography--headline5">
                                    {this.getCoin()} {this.props.balance.amount.toString()}
                                </p>
                            </Card>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell cols={8}>
                            <Card className="card address-card">
                                <Translate
                                    text="DashboardPage.walletAddress"
                                    tag="p"
                                    className="mdc-typography--body2"
                                />
                                <TextareaAutoSize
                                    value={this.props.account.address}
                                    noBorder
                                    inputRef={el => (this.textareaElement = el)}
                                    className="address-textarea"
                                />
                                <Card.Actions>
                                    <Card.ActionButton
                                        ripple
                                        className="copy-button"
                                        onClick={() => this.copyToClipboard()}
                                    >
                                        <Icon>file_copy</Icon>
                                        <Translate text="DashboardPage.copy" />
                                    </Card.ActionButton>
                                </Card.Actions>
                            </Card>
                        </LayoutGrid.Cell>

                        {
                            <LayoutGrid.Cell cols={12}>
                                {this.props.account.transactions.length === 0 && (
                                    <Translate
                                        text="DashboardPage.noTransactions"
                                        subtitle1
                                        className="center-text"
                                    />
                                )}
                                {this.props.account.transactions.length > 0 && (
                                    <Elevation z={2}>
                                        <List className="transactions-list" two-line={true}>
                                            {this.props.account.transactions.map(tx => (
                                                <div>
                                                    <List.LinkItem
                                                        href={`/transaction/${
                                                            typeof tx.txn === 'string'
                                                                ? tx.txn
                                                                : (tx.txn as any).TranID
                                                        }`}
                                                    >
                                                        <List.ItemGraphic>
                                                            file_copy
                                                        </List.ItemGraphic>
                                                        <List.TextContainer>
                                                            <List.PrimaryText>
                                                                {this.getCoin()}{' '}
                                                                {convertUnit(
                                                                    this.props.blockchain,
                                                                    new BigNumber(
                                                                        (tx as any).value ||
                                                                            (tx as any).amount
                                                                    ),
                                                                    this.props.blockchainInfo
                                                                        .defaultUnit,
                                                                    this.props.blockchainInfo.coin
                                                                ).toString()}
                                                            </List.PrimaryText>
                                                            <List.SecondaryText>
                                                                {(tx.data || '').toString()}
                                                            </List.SecondaryText>
                                                        </List.TextContainer>
                                                        <List.ItemMeta>
                                                            keyboard_arrow_right
                                                        </List.ItemMeta>
                                                    </List.LinkItem>
                                                    <List.Divider />
                                                </div>
                                            ))}
                                        </List>
                                    </Elevation>
                                )}
                            </LayoutGrid.Cell>
                        }
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        );
    }

    private copyToClipboard() {
        this.textareaElement.select();
        document.execCommand('copy');
    }
}
