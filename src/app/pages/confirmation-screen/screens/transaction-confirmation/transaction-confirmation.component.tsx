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

interface IProps {
    id: string;
    params: {
        blockchain: Blockchain;
        fromAddress: string;
        toAddress: string;
        amount: string;
        gasPrice: string;
        gasLimit: string;
    };
    sender: Runtime.MessageSender;

    testNet: boolean;
    currentNetworkName: string;
    currentNetworkId: number;
    accounts: string[];
    walletReady: boolean;
}

export class TransactionConfirmationPage extends Component<IProps> {
    public confirmationDialog;
    public errorDialog;
    public url: URL = new URL(location.href);

    public render() {
        if (!this.props.walletReady) {
            return '';
        }

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
                                text="ConfirmationScreen.TransactionConfirmation.confirmTransaction"
                            />
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell cols={12}>
                            <TextareaAutoSize
                                outlined
                                disabled
                                label={translate('App.labels.from')}
                                value={this.props.params.fromAddress}
                            />
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell cols={12}>
                            <TextareaAutoSize
                                outlined
                                disabled
                                label={translate('App.labels.recipient')}
                                value={this.props.params.toAddress}
                            />
                        </LayoutGrid.Cell>
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
