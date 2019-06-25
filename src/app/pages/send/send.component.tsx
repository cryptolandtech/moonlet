import { Component, h } from 'preact';
import { TextareaAutoSize } from '../../components/textarea-auto-size/textarea-auto-size.components';
import LayoutGrid, { LayoutGridCell } from 'preact-material-components/LayoutGrid';
import { Button } from 'preact-material-components/Button';

import './send.scss';
import { GenericAccount, AccountType } from 'moonlet-core/src/core/account';
import TransactionFee from './components/transaction-fee/transaction-fee.container';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IBlockchainInfo, BLOCKCHAIN_INFO } from '../../../utils/blockchain/blockchain-info';
import {
    convertUnit,
    getDefaultFeeOptions,
    formatCurrency,
    calculateFee,
    formatAmount
} from '../../../utils/blockchain/utils';
import { FeeOptions } from '../../../utils/blockchain/types';
import { translate } from '../../utils/translate';
import { Translate } from '../../components/translate/translate.component';
import Dialog from 'preact-material-components/Dialog';
import { BigNumber } from 'bignumber.js';
import { IWalletTransfer } from '../../data/wallet/state';
import { getWalletPlugin, getPlugins } from '../../app-context';
import { AccountCard } from '../account/components/account-card/account-card.component';
import Currency from '../../components/currency/currency.container';
import { Loader } from '../../components/material-components/loader/loader.component';
import { UDApiClient } from '../../utils/ud-api-client';
import { IUserPreferences } from '../../data/user-preferences/state';
import { Navigation } from '../../utils/navigation';
import { capitalize } from '../../utils/string';
import { feature, FEATURE_SEND_PAGE_NAME_RESOLUTION } from '../../utils/feature';
import Icon from 'preact-material-components/Icon';
import { bind } from 'bind-decorator';
import { RevealPage } from '../reveal/reveal.component';
import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { toBech32Address } from '@zilliqa-js/crypto/dist/bech32';

interface IProps {
    blockchain: Blockchain;
    blockchainInfo: IBlockchainInfo;
    account: GenericAccount;
    balance: number;
    transferInfo: IWalletTransfer;
    userPreferences: IUserPreferences;

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
    recipientIsDomain: boolean;
    recipientResolveInProgress: boolean;
    address: string;
    displayAddress: string;
    amount: string;
    feeOptions: FeeOptions;
    fieldErrors: {
        amount: string;
        recipient: string;
    };
    errorDialogExtraMessage?: string;
    hwDeviceConnected: boolean;
}

export class SendPage extends Component<IProps, IState> {
    public confirmationDialog;
    public errorDialog;
    public progressDialog;
    public addressInfoDialog;

    constructor(props: IProps) {
        super(props);
        this.state = {
            recipient: '',
            recipientIsDomain: false,
            recipientResolveInProgress: false,
            address: '',
            displayAddress: '',
            amount: undefined,
            feeOptions: getDefaultFeeOptions(props.blockchain),

            hwDeviceConnected: false,

            fieldErrors: {
                amount: '',
                recipient: ''
            }
        };
    }

    public componentDidUpdate(prevProps: IProps) {
        if (
            this.props.transferInfo.inProgress === false &&
            prevProps.transferInfo.inProgress !== this.props.transferInfo.inProgress
        ) {
            this.progressDialog.MDComponent.close();
            if (this.props.transferInfo.success) {
                Navigation.goTo(
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
                            <AccountCard account={this.props.account} showAddress />
                        </LayoutGridCell>

                        <LayoutGridCell cols={12} className="recipient-cell">
                            <TextareaAutoSize
                                outlined
                                label={translate('App.labels.recipient')}
                                onChange={e =>
                                    this.setState({
                                        recipient: e.target.value,
                                        address: undefined,
                                        displayAddress: undefined
                                    })
                                }
                                onBlur={this.onRecipientBlur}
                                value={this.state.recipient}
                                helperText={this.getRecipientHelperText()}
                            />
                            {this.state.recipientResolveInProgress && (
                                <Loader className="loader" width="30px" height="30px" />
                            )}
                        </LayoutGridCell>
                        <LayoutGridCell cols={12}>
                            <TextareaAutoSize
                                outlined
                                label={translate('App.labels.amount')}
                                onChange={e => {
                                    const amount = e.target.value;
                                    const amountFormatted = formatAmount(
                                        this.props.blockchain,
                                        amount
                                    );
                                    this.setState({
                                        amount:
                                            amount.length > amountFormatted.length
                                                ? amountFormatted
                                                : amount
                                    });
                                    this.validate();
                                }}
                                value={this.state.amount ? String(this.state.amount) : ''}
                                helperText={
                                    <span class="amount-helper-text">
                                        {this.state.fieldErrors.amount ? (
                                            <span class="error-text">
                                                {this.state.fieldErrors.amount}
                                            </span>
                                        ) : (
                                            <span>
                                                {this.state.amount
                                                    ? [
                                                          '~ ',
                                                          <Currency
                                                              amount={parseFloat(this.state.amount)}
                                                              currency={
                                                                  this.props.blockchainInfo.coin
                                                              }
                                                              convert
                                                          />
                                                      ]
                                                    : ''}
                                            </span>
                                        )}
                                        {this.getMaxAmount() &&
                                            this.getMaxAmount().toString() !==
                                                this.state.amount && (
                                                <span class="right-text">
                                                    <a
                                                        href="#"
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            this.setState({
                                                                amount: this.getMaxAmount().toString()
                                                            });
                                                            this.validate();
                                                        }}
                                                    >
                                                        {translate('SendPage.addAllBalance')}
                                                    </a>
                                                </span>
                                            )}
                                    </span>
                                }
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
                                address: this.state.recipientIsDomain
                                    ? `${this.state.recipient} (${this.state.displayAddress})`
                                    : this.state.recipient
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

                <Dialog ref={el => (this.progressDialog = el)}>
                    <Dialog.Body className="center-text">
                        <Loader width="40px" height="40px" />

                        {this.props.account.type === AccountType.HARDWARE && (
                            <div>
                                {this.state.hwDeviceConnected ? (
                                    <Translate
                                        body1
                                        text="SendPage.progressDialog.instructionsSign"
                                    />
                                ) : (
                                    <Translate
                                        body1
                                        text="SendPage.progressDialog.instructionsConnect"
                                        params={{ appName: capitalize(this.props.blockchain) }}
                                    />
                                )}
                            </div>
                        )}
                    </Dialog.Body>
                </Dialog>

                <Dialog
                    ref={el => (this.addressInfoDialog = el)}
                    class="address-info-dialog dialog-full-screen"
                >
                    <Dialog.Header>
                        <Translate text="App.labels.info" />
                    </Dialog.Header>
                    <Dialog.Body scrollable={true}>
                        <RevealPage
                            type="addressFormat"
                            account={{
                                addressFormats: {
                                    default: this.state.displayAddress,
                                    base16: this.state.address
                                },
                                node: {
                                    blockchain: this.props.blockchain
                                }
                            }}
                        />
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.FooterButton cancel={true}>
                            {translate('App.labels.close')}
                        </Dialog.FooterButton>
                    </Dialog.Footer>
                </Dialog>
            </div>
        );
    }

    public getDisplayAddress(address) {
        let displayAddress = address;

        if (this.props.blockchain === Blockchain.ZILLIQA && !isBech32(address)) {
            displayAddress = toBech32Address(address);
        }

        return displayAddress;
    }

    @bind
    public onRecipientBlur() {
        // todo enforce this check
        if (
            feature.isActive(FEATURE_SEND_PAGE_NAME_RESOLUTION) &&
            this.state.recipient.indexOf('.') > 0
        ) {
            // domain, lookup for address
            this.setState({
                recipientIsDomain: true,
                recipientResolveInProgress: true,
                address: undefined,
                displayAddress: undefined
            });

            new UDApiClient(this.props.blockchainInfo.coin).resolve(this.state.recipient).then(
                data => {
                    if (data.address) {
                        if (data.name === this.state.recipient) {
                            this.setState({
                                recipientResolveInProgress: false,
                                address: data.address,
                                displayAddress: this.getDisplayAddress(data.address)
                            });
                        }
                    } else {
                        this.setState({
                            recipientResolveInProgress: false,
                            address: undefined,
                            displayAddress: undefined
                        });
                    }
                    this.validate(true);
                },
                error => {
                    this.setState({
                        recipientResolveInProgress: false,
                        address: undefined,
                        displayAddress: undefined
                    });
                    this.validate(true);
                }
            );
        } else {
            this.setState({
                recipientIsDomain: false,
                address: this.state.recipient,
                displayAddress: this.state.recipient
            });
            this.validate(true);
        }
    }

    public getRecipientHelperText() {
        if (this.state.fieldErrors.recipient) {
            return <span class="error-text">{this.state.fieldErrors.recipient}</span>;
        } else if (this.state.recipientIsDomain) {
            return (
                <span
                    class="resolved-address"
                    onClick={() => {
                        if (this.state.displayAddress !== this.state.address) {
                            this.addressInfoDialog.MDComponent.show();
                        }
                    }}
                >
                    {this.state.displayAddress}
                    {this.state.displayAddress !== this.state.address && <Icon>info</Icon>}
                </span>
            );
        }

        return '';
    }

    public onFeeOptionsChange(feeOptions) {
        this.setState({ feeOptions });
        this.validate();
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

    public getMaxAmount(): number {
        const fee = calculateFee(this.props.blockchain, this.state.feeOptions).toNumber();
        if (this.props.balance && this.props.balance > fee) {
            return parseFloat(
                formatAmount(this.props.blockchain, (this.props.balance - fee).toString())
            );
        }
        return undefined;
    }

    public async isAddressValid() {
        const walletProvider = getWalletPlugin();
        try {
            if (!(await walletProvider.isValidAddress(this.props.blockchain, this.state.address))) {
                return false;
            }
        } catch {
            return false;
        }

        return true;
    }

    public async validateRecipient() {
        let error;

        if (!this.state.recipientIsDomain && !(await this.isAddressValid())) {
            error = translate('SendPage.errors.recipient');
        }

        if (this.state.recipientIsDomain) {
            if (this.state.recipientResolveInProgress) {
                error = translate('SendPage.errors.recipientLookupInProgress');
            } else {
                if (this.state.address) {
                    if (!(await this.isAddressValid())) {
                        error = translate('SendPage.errors.recipientNameAddressInvalid');
                    }
                } else {
                    // TODO add affiliate url
                    error = translate('SendPage.errors.recipientNameNotFound');
                }
            }
        }

        return {
            valid: !!!error,
            error
        };
    }

    public async validate(onlyRecipient?: boolean) {
        let valid = true;
        const fieldErrors = {
            amount: '',
            recipient: ''
        };

        const recipientError = await this.validateRecipient();
        if (!recipientError.valid) {
            fieldErrors.recipient = recipientError.error;
            valid = false;
        }

        if (!onlyRecipient) {
            const fee = calculateFee(this.props.blockchain, this.state.feeOptions).toNumber();
            if (!this.state.amount || !(parseFloat(this.state.amount) > 0)) {
                fieldErrors.amount = translate('SendPage.errors.amount');
                valid = false;
            } else if (
                typeof this.props.balance === 'number' &&
                parseFloat(this.state.amount) + fee > this.props.balance
            ) {
                fieldErrors.amount = translate('SendPage.errors.insufficientFounds');
                valid = false;
            }

            if (this.state.feeOptions === undefined) {
                valid = false;
            }
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
        this.setState({ hwDeviceConnected: false });
        this.progressDialog.MDComponent.show();
        if (this.props.account.type === AccountType.HARDWARE) {
            const ledgerAppName =
                BLOCKCHAIN_INFO[this.props.blockchain].hardwareWallet.ledger.appName;
            await getPlugins().ledgerHw.detectAppOpen(ledgerAppName);

            const ledgerAccount = await getPlugins().ledgerHw.getAddress(ledgerAppName, {
                index: this.props.account.accountIndex as any,
                derivationIndex: this.props.account.derivationIndex as any,
                path: this.props.account.derivationPath
            });
            if (ledgerAccount.address !== this.props.account.address) {
                this.progressDialog.MDComponent.close();
                this.showErrorDialog(translate('SendPage.errors.hwAccountError'));
                return;
            }
            this.setState({ hwDeviceConnected: true });
        }

        const amount = new BigNumber(this.state.amount);
        this.props.transfer(
            this.props.blockchain,
            this.props.account.address,
            this.state.address,
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
