import { Component, h } from 'preact';

import Card from 'preact-material-components/Card';
import Icon from 'preact-material-components/Icon';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import './dashboard.scss';
import List from 'preact-material-components/List';
import Elevation from 'preact-material-components/Elevation';
import { Translate } from '../../components/translate/translate.component';
import { TextareaAutoSize } from '../../components/textarea-auto-size/textarea-auto-size.components';
import { GenericAccount } from 'moonlet-core/src/core/account';
import { BLOCKCHAIN_INFO } from '../../utils/blockchain/blockchain-info';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { Typography } from 'preact-material-components/Typography';

interface IProps {
    account: GenericAccount;
    blockchain: Blockchain;
}

export class DashboardPage extends Component<IProps, any> {
    private textareaElement: HTMLTextAreaElement;

    constructor(props: IProps) {
        super(props);
        this.state = {
            balance: '...'
        };

        this.updateBalance();
    }

    public componentDidUpdate(prevProps: IProps) {
        if (
            this.props.blockchain !== prevProps.blockchain ||
            this.props.account.address !== prevProps.account.address
        ) {
            this.setState({ balance: '...' });
            this.updateBalance();
        }
    }

    public updateBalance() {
        this.props.account
            .getBalance()
            .then(balance => {
                this.setState({
                    balance: this.props.account.utils.balanceToStd(balance)
                });
            })
            .catch(err => {
                this.setState({
                    balance: 'error'
                });
            });
    }

    public getCoin() {
        return BLOCKCHAIN_INFO[this.props.blockchain].coin;
    }

    public render() {
        return (
            <div className="dashboard-page">
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols={4} tabletCols={8}>
                            <Card className="card balance-card">
                                <Translate
                                    text="DashboardPage.totalBalance"
                                    tag="p"
                                    className="mdc-typography--body2"
                                />
                                <p className="mdc-typography--headline5">
                                    {this.getCoin()} {this.state.balance}
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

                        <LayoutGrid.Cell cols={12}>
                            {this.props.account.getTransactions().length === 0 && (
                                <Translate
                                    text="DashboardPage.noTransactions"
                                    subtitle1
                                    className="center-text"
                                />
                            )}
                            {this.props.account.getTransactions().length > 0 && (
                                <Elevation z={2}>
                                    <List className="transactions-list" two-line={true}>
                                        {this.props.account.getTransactions().map(tx => (
                                            <div>
                                                <List.LinkItem href={`/transaction/${tx.txn}`}>
                                                    <List.ItemGraphic>file_copy</List.ItemGraphic>
                                                    <List.TextContainer>
                                                        <List.PrimaryText>
                                                            {this.getCoin()}{' '}
                                                            {(tx as any).value ||
                                                                (tx as any).amount}
                                                        </List.PrimaryText>
                                                        <List.SecondaryText>
                                                            05/07/2018 4:23:38 PM
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
