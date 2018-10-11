import { Component, h } from 'preact';
import { TextareaAutoSize } from '../../components/textarea-auto-size/textarea-auto-size.components';
import LayoutGrid, { LayoutGridCell } from 'preact-material-components/LayoutGrid';
import { Button } from 'preact-material-components/Button';

import './send.scss';
import { GenericAccount } from 'moonlet-core/src/core/account';
import TransactionFee from './components/transaction-fee/transaction-fee.container';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IBlockchainInfo, BlockchainFeeType } from '../../utils/blockchain/blockchain-info';
import { getDefaultFeeOptions, formatCurrency } from '../../utils/blockchain/utils';
import { FeeOptions, IGasFeeOptions } from '../../utils/blockchain/types';
import { translate } from '../../utils/translate';
import { Translate } from '../../components/translate/translate.component';
import Dialog from 'preact-material-components/Dialog';
import { TextField } from 'preact-material-components/TextField';
import { route } from 'preact-router';

interface IProps {
    blockchain: Blockchain;
    blockchainInfo: IBlockchainInfo;
    account: GenericAccount;
}

interface IState {
    recipient: string;
    amount: number;
    feeOptions: FeeOptions;
    fieldErrors: {
        amount: string;
        recipient: string;
    };
    errorDialogExtraMessage?: string;
}

export class SendPage extends Component<IProps, IState> {
    public sliderRef;
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
            }
        };

        // let tx = props.account.buildTransferTransaction("", 0.1, 1, 21000, 2)
        // // props.account.estimateTransferTransaction("0xea84F4178e30e196f77A7675B5E29fc7833FceFE", 0.1, 1).then(data => {
        // //     console.log(data);
        // // });

        // props.account.node.rpcCall("eth_estimateGas", [{
        //     from: "0x200d152B0E607D830B9265a1897b2060630DB142",
        //     // to: "0xea84F4178e30e196f77A7675B5E29fc7833FceFE",
        //     //data: "0x"
        // }]).then(data => {
        //     console.log(data);
        // });
    }

    public render() {
        return (
            <div class="send-page">
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGridCell cols={12}>
                            <TextareaAutoSize
                                outlined
                                label={translate('App.labels.recipient')}
                                onChange={e => this.setState({ recipient: e.target.value })}
                                {...this.getValidationProps('recipient')}
                            />
                        </LayoutGridCell>
                        <LayoutGridCell cols={12}>
                            <TextareaAutoSize
                                outlined
                                label={translate('App.labels.amount')}
                                onChange={e => this.setState({ amount: e.target.value })}
                                {...this.getValidationProps('amount')}
                            />
                        </LayoutGridCell>
                    </LayoutGrid.Inner>
                </LayoutGrid>

                <TransactionFee
                    recipient={this.state.recipient}
                    amount={this.state.amount}
                    feeOptions={this.state.feeOptions}
                    onChange={this.onFeeOptionsChange.bind(this)}
                />

                <LayoutGrid class="right-text">
                    <Button ripple raised secondary onClick={this.onConfirmClick.bind(this)}>
                        <Translate text="App.labels.confirm" />
                    </Button>
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
                            text="SendPage.confirmationDialog.message"
                            params={{
                                amount: formatCurrency(
                                    this.state.amount,
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
                                <br />
                                <br />
                                DEBUG:
                                <br />
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

    public validate() {
        let valid = true;
        const fieldErrors = {
            amount: '',
            recipient: ''
        };

        if (!this.state.recipient) {
            fieldErrors.recipient = translate('SendPage.errors.recipient');
            valid = false;
        }

        if (!this.state.amount || !(this.state.amount > 0)) {
            fieldErrors.amount = translate('SendPage.errors.amount');
            valid = false;
        }

        this.setState({ fieldErrors });
        return valid;
    }

    public onConfirmClick() {
        if (this.validate()) {
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
        try {
            const nonce = await this.props.account.getNonce();

            const tx = this.props.account.buildTransferTransaction(
                this.state.recipient,
                this.state.amount,
                nonce,
                (this.state.feeOptions as IGasFeeOptions).gasPrice,
                1
            );
            this.props.account.signTransaction(tx);
            const response = await this.props.account.send(tx);
            // console.log(response);
            route('/dashboard');
        } catch (e) {
            // console.log(e);
            this.showErrorDialog(e.toString());
        }
    }
}
