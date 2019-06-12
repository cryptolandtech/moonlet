import { Component, h } from 'preact';
import { TextareaAutoSize } from '../../../../components/textarea-auto-size/textarea-auto-size.components';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Button from 'preact-material-components/Button';

import './transaction-confirmation.scss';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { BLOCKCHAIN_INFO } from '../../../../../utils/blockchain/blockchain-info';
import { calculateFee, convertUnit } from '../../../../../utils/blockchain/utils';
import { translate } from '../../../../utils/translate';
import { Translate } from '../../../../components/translate/translate.component';
import { BigNumber } from 'bignumber.js';
import Typography from 'preact-material-components/Typography';
import { Runtime } from 'webextension-polyfill-ts';
import { Response } from '../../../../../utils/response';
import { getPlugins } from '../../../../app-context';
import Chips from 'preact-material-components/Chips';
import { removeType } from '../../../../utils/remove-type';
import Dialog from 'preact-material-components/Dialog';
import TextField from 'preact-material-components/TextField';

interface IProps {
    id: string;
    params: {
        blockchain: Blockchain;
        fromAddress: string;
        toAddress: string;
        amount: string;
        gasPrice: string;
        gasLimit: string;
        data: string;
        code: string;
    };
    sender: Runtime.MessageSender;

    testNet: boolean;
    currentNetworkName: string;
    currentNetworkId: number;
    accounts: string[];
    walletReady: boolean;
}

enum TransactionType {
    TRANSFER = 'TRANSFER',
    CONTRACT_DEPLOY = 'CONTRACT_DEPLOY',
    CONTRACT_CALL = 'CONTRACT_CALL'
}

export class TransactionConfirmationPage extends Component<IProps> {
    public detailsDialog;

    public url: URL = new URL(location.href);

    public getParsedData() {
        try {
            const dataObj = JSON.parse(this.props.params.data);
            return dataObj ? dataObj : undefined;
        } catch {
            return undefined;
        }
    }

    public getTransactionDetails() {
        const { toAddress, code } = this.props.params;
        const data = this.getParsedData();

        let type = TransactionType.TRANSFER;
        if (
            code &&
            (toAddress === 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz' ||
                toAddress === '0x0000000000000000000000000000000000000000')
        ) {
            type = TransactionType.CONTRACT_DEPLOY;
        } else if (data && data._tag) {
            type = TransactionType.CONTRACT_CALL;
        }

        return {
            type,
            data,
            code
        };
    }

    public render() {
        if (!this.props.walletReady) {
            return '';
        }
        const txInfo = this.getTransactionDetails();
        const blockchainInfo = BLOCKCHAIN_INFO[this.props.params.blockchain];
        const fee = calculateFee(this.props.params.blockchain, {
            gasPrice: new BigNumber(this.props.params.gasPrice).toNumber(),
            gasLimit: new BigNumber(this.props.params.gasLimit).toNumber()
        });
        const amount = convertUnit(
            this.props.params.blockchain,
            new BigNumber(this.props.params.amount),
            blockchainInfo.defaultUnit,
            blockchainInfo.coin
        );
        const total = amount.plus(fee);

        const textsMap = {
            title: {
                [TransactionType.CONTRACT_CALL]: 'confirmContractCall',
                [TransactionType.CONTRACT_DEPLOY]: 'confirmContractDeploy',
                [TransactionType.TRANSFER]: 'confirmTransaction'
            },
            action: {
                [TransactionType.CONTRACT_DEPLOY]: 'deploy',
                [TransactionType.TRANSFER]: 'transfer'
            }
        };
        return (
            <div class="transaction-confirmation-page">
                <div class={`current-network ${this.props.testNet ? 'testnet' : ''}`}>
                    {this.props.currentNetworkName}
                </div>
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols={12} className="center-text">
                            <Translate
                                body1
                                text={`ConfirmationScreen.TransactionConfirmation.${
                                    textsMap.title[txInfo.type]
                                }`}
                            />
                        </LayoutGrid.Cell>
                        {(txInfo.data || txInfo.code) && (
                            <LayoutGrid.Cell cols={12}>
                                <Chips.Chip>
                                    {removeType(
                                        <Chips.Text>
                                            {textsMap.action[txInfo.type] ? (
                                                <Translate
                                                    text={`ConfirmationScreen.TransactionConfirmation.${
                                                        textsMap.action[txInfo.type]
                                                    }`}
                                                />
                                            ) : (
                                                txInfo.data._tag
                                            )}
                                        </Chips.Text>
                                    )}
                                </Chips.Chip>
                                <a
                                    class="details-link secondary-color"
                                    onClick={() => this.detailsDialog.MDComponent.show()}
                                >
                                    Show details
                                </a>
                            </LayoutGrid.Cell>
                        )}
                        <LayoutGrid.Cell cols={12}>
                            <TextareaAutoSize
                                outlined
                                disabled
                                label={translate('App.labels.from')}
                                value={this.props.params.fromAddress}
                            />
                        </LayoutGrid.Cell>
                        {txInfo.type !== TransactionType.CONTRACT_DEPLOY && (
                            <LayoutGrid.Cell cols={12}>
                                <TextareaAutoSize
                                    outlined
                                    disabled
                                    label={translate('App.labels.recipient')}
                                    value={this.props.params.toAddress}
                                />
                            </LayoutGrid.Cell>
                        )}
                        <LayoutGrid.Cell cols={12}>
                            <TextareaAutoSize
                                outlined
                                disabled
                                label={
                                    translate('App.labels.amount') +
                                    ' (' +
                                    blockchainInfo.coin +
                                    ')'
                                }
                                value={amount.toString()}
                            />
                        </LayoutGrid.Cell>

                        <LayoutGrid.Cell cols={12}>
                            <Translate text="App.labels.fee" body2 style="float:left" />
                            <Typography body2 style="float:right">
                                {fee.toString() + ' ' + blockchainInfo.coin}
                            </Typography>
                        </LayoutGrid.Cell>

                        <LayoutGrid.Cell cols={12}>
                            <Translate text="App.labels.total" headline6 style="float:left" />
                            <Typography headline6 style="float:right">
                                {total.toString() + ' ' + blockchainInfo.coin}
                            </Typography>
                        </LayoutGrid.Cell>

                        <LayoutGrid.Cell desktopCols={6} tabletCols={4} phoneCols={2}>
                            <Button
                                ripple
                                raised
                                onClick={() => this.sendResult(false)}
                                className="button reject"
                            >
                                <Translate text="App.labels.cancel" />
                            </Button>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell
                            desktopCols={6}
                            tabletCols={4}
                            phoneCols={2}
                            className="right-text"
                        >
                            <Button
                                ripple
                                raised
                                secondary
                                onClick={() => this.sendResult(true)}
                                className="button confirm"
                            >
                                <Translate text="App.labels.confirm" />
                            </Button>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>

                <Dialog ref={ref => (this.detailsDialog = ref)} class="details-dialog">
                    <Dialog.Header>Transaction Details</Dialog.Header>
                    <Dialog.Body scrollable={true}>
                        {txInfo.code && (
                            <TextField
                                class="details-box"
                                readOnly
                                textarea={true}
                                label="Code"
                                value={txInfo.code}
                            />
                        )}
                        {txInfo.data && (
                            <TextField
                                class="details-box"
                                readOnly
                                textarea={true}
                                label="Data"
                                value={JSON.stringify(txInfo.data, null, 2)}
                            />
                        )}
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.FooterButton cancel={true}>Close</Dialog.FooterButton>
                    </Dialog.Footer>
                </Dialog>
            </div>
        );
    }

    public async sendResult(confirmed) {
        try {
            if (confirmed) {
                await getPlugins().confirmationScreen.setConfirmationScreenResult(
                    this.props.id,
                    Response.resolve()
                );
            }
        } catch {
            /* */
        }
        window.close();
    }
}
