import { Component, h } from 'preact';
import { TextareaAutoSize } from '../../components/textarea-auto-size/textarea-auto-size.components';
import LayoutGrid, { LayoutGridCell } from 'preact-material-components/LayoutGrid';
import { Button } from 'preact-material-components/Button';

import './send.scss';
import { GenericAccount } from 'moonlet-core/src/core/account';
import TransactionFee from './components/transaction-fee/transaction-fee.container';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IBlockchainInfo } from '../../utils/blockchain/blockchain-info';
import { convertUnit, getDefaultFeeOptions, formatCurrency } from '../../utils/blockchain/utils';
import { FeeOptions } from '../../utils/blockchain/types';
import { translate } from '../../utils/translate';
import { Translate } from '../../components/translate/translate.component';
import Dialog from 'preact-material-components/Dialog';
import { BigNumber } from 'bignumber.js';
import { IWalletTransfer } from '../../data/wallet/state';
import { route } from 'preact-router';
import { getWalletProvider } from '../../app-context';
import Card from 'preact-material-components/Card';
import AddressCard from '../account/components/address-card/address-card.container';
import { AccountCard } from '../account/components/account-card/account-card.component';
import Currency from '../../components/currency/currency.container';

interface IProps {
    blockchain: Blockchain;
    blockchainInfo: IBlockchainInfo;
    account: GenericAccount;
    transferInfo: IWalletTransfer;

    transfer: (
        blockchain: Blockchain,
        fromAddress: string,
        toAddress: string,
        amount: BigNumber,
        feeOptions: FeeOptions
    ) => any;
}

interface IState {
    recipient: string;
    amount: string;
    feeOptions: FeeOptions;
    fieldErrors: {
        amount: string;
        recipient: string;
    };
    errorDialogExtraMessage?: string;
    disabled: boolean;
}

export class SendPage extends Component<IProps, IState> {
    public confirmationDialog;
    public errorDialog;

    constructor(props: IProps) {
        super(props);
        this.state = {
            recipient: '',
            amount: undefined,
            feeOptions: getDefaultFeeOptions(props.blockchain),

            fieldErrors: {
                amount: '',
                recipient: ''
            },
            disabled:
                props.account &&
                props.account.node.blockchain === Blockchain.ZILLIQA &&
                props.account.node.network.network_id === 0
        };
    }

    public componentDidUpdate(prevProps: IProps) {
        if (
            this.props.transferInfo.inProgress === false &&
            prevProps.transferInfo.inProgress !== this.props.transferInfo.inProgress
        ) {
            if (this.props.transferInfo.success) {
                route(
                    `/account/${this.props.account.node.blockchain}/${this.props.account.address}`,
                    true
                );
            } else {
                this.showErrorDialog(this.props.transferInfo.error);
            }
        }
    }

    public render() {
        return (
            <div class="send-page">
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGridCell cols={12}>
                            <AccountCard account={this.props.account} />
                        </LayoutGridCell>
                        <LayoutGridCell cols={12}>
                            <AddressCard account={this.props.account} />
                        </LayoutGridCell>
                        {this.state.disabled && (
                            <LayoutGridCell cols={12}>
                                <Card className="card">
                                    <p
                                        style="padding: 16px; font-weight:bold"
                                        className="mdc-typography--body2"
                                    >
                                        WARNING!!!
                                        <br />
                                        Transactions are not processed during the bootstrap phase.
                                    </p>
                                </Card>
                            </LayoutGridCell>
                        )}
                        <LayoutGridCell cols={12}>
                            <TextareaAutoSize
                                outlined
                                label={translate('App.labels.recipient')}
                                onChange={e => this.setState({ recipient: e.target.value })}
                                value={this.state.recipient}
                                {...this.getValidationProps('recipient')}
                            />
                        </LayoutGridCell>
                        <LayoutGridCell cols={12}>
                            <TextareaAutoSize
                                outlined
                                label={translate('App.labels.amount')}
                                onChange={e => this.setState({ amount: e.target.value })}
                                value={this.state.amount ? String(this.state.amount) : ''}
                                helperText={
                                    this.state.amount ? (
                                        <span>
                                            ~{' '}
                                            <Currency
                                                amount={parseFloat(this.state.amount)}
                                                currency={this.props.blockchainInfo.coin}
                                                convert
                                            />
                                        </span>
                                    ) : (
                                        ''
                                    )
                                }
                                {...this.getValidationProps('amount')}
                            />
                        </LayoutGridCell>
                    </LayoutGrid.Inner>
                </LayoutGrid>

                <TransactionFee
                    recipient={this.state.recipient}
                    amount={this.state.amount}
                    feeOptions={this.state.feeOptions}
                    blockchain={this.props.blockchain}
                    blockchainInfo={this.props.blockchainInfo}
                    onChange={this.onFeeOptionsChange.bind(this)}
                />

                <LayoutGrid class="right-text">
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols={2} phoneCols={4}>
                            <Button
                                className="cta"
                                disabled={this.state.disabled}
                                ripple
                                raised
                                secondary
                                onClick={this.onConfirmClick.bind(this)}
                            >
                                <Translate text="App.labels.confirm" />
                            </Button>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>

                <Dialog
                    ref={el => (this.confirmationDialog = el)}
                    onAccept={this.onConfirm.bind(this)}
                >
                    <Dialog.Header>
                        <Translate text="SendPage.confirmationDialog.title" />
                    </Dialog.Header>
                    <Dialog.Body>
                        <Translate
                            className="confirmation-message"
                            text="SendPage.confirmationDialog.message"
                            params={{
                                amount: formatCurrency(
                                    new BigNumber(this.state.amount),
                                    this.props.blockchainInfo.coin
                                ),
                                address: this.state.recipient
                            }}
                        />
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.FooterButton cancel={true}>
                            {translate('App.labels.cancel')}
                        </Dialog.FooterButton>
                        <Dialog.FooterButton accept={true}>
                            {translate('App.labels.send')}
                        </Dialog.FooterButton>
                    </Dialog.Footer>
                </Dialog>

                <Dialog ref={el => (this.errorDialog = el)}>
                    <Dialog.Header>
                        <Translate text="App.labels.alert" />
                    </Dialog.Header>
                    <Dialog.Body>
                        <Translate text="SendPage.errorDialog.generic" />
                        {this.state.errorDialogExtraMessage && (
                            <p>
                                Details:
                                <br />
                                {this.state.errorDialogExtraMessage}
                            </p>
                        )}
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.FooterButton cancel={true}>
                            {translate('App.labels.ok')}
                        </Dialog.FooterButton>
                    </Dialog.Footer>
                </Dialog>
            </div>
        );
    }

    public onFeeOptionsChange(feeOptions) {
        this.setState({ feeOptions });
    }

    public getValidationProps(field: string) {
        if (this.state.fieldErrors[field]) {
            return {
                helperText: this.state.fieldErrors[field],
                helperTextValidationMsg: true
            };
        }
        return {};
    }

    public async validate() {
        const walletProvider = getWalletProvider();
        let valid = true;
        const fieldErrors = {
            amount: '',
            recipient: ''
        };

        if (!(await walletProvider.isValidAddress(this.props.blockchain, this.state.recipient))) {
            fieldErrors.recipient = translate('SendPage.errors.recipient');
            valid = false;
        }

        if (!this.state.amount || !(parseFloat(this.state.amount) > 0)) {
            fieldErrors.amount = translate('SendPage.errors.amount');
            valid = false;
        }

        if (this.state.feeOptions === undefined) {
            valid = false;
        }

        this.setState({ fieldErrors });
        return valid;
    }

    public async onConfirmClick() {
        if (await this.validate()) {
            this.confirmationDialog.MDComponent.show();
        }
    }

    public showErrorDialog(message: string = '') {
        this.setState({
            errorDialogExtraMessage: message
        });
        this.errorDialog.MDComponent.show();
    }

    public async onConfirm() {
        const amount = new BigNumber(this.state.amount);
        this.props.transfer(
            this.props.blockchain,
            this.props.account.address,
            this.state.recipient,
            convertUnit(
                this.props.blockchain,
                amount,
                this.props.blockchainInfo.coin,
                this.props.blockchainInfo.defaultUnit
            ),
            this.state.feeOptions
        );
    }
}
