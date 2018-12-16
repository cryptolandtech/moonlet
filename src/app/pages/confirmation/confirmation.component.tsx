import { Component, h } from 'preact';
import { TextareaAutoSize } from '../../components/textarea-auto-size/textarea-auto-size.components';
import LayoutGrid, { LayoutGridCell } from 'preact-material-components/LayoutGrid';
import { Button } from 'preact-material-components/Button';

import './confirmation.scss';
import { GenericAccount } from 'moonlet-core/src/core/account';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IBlockchainInfo } from '../../utils/blockchain/blockchain-info';
import {
    convertUnit,
    getDefaultFeeOptions,
    formatCurrency,
    calculateFee
} from '../../utils/blockchain/utils';
import { FeeOptions, IGasFeeOptions } from '../../utils/blockchain/types';
import { translate } from '../../utils/translate';
import { Translate } from '../../components/translate/translate.component';
import Dialog from 'preact-material-components/Dialog';
import { route } from 'preact-router';
import { BigNumber } from 'bignumber.js';
import Typography from 'preact-material-components/Typography';
import { browser } from 'webextension-polyfill-ts';
import { storeWallet, getPassword } from '../../utils/wallet';

interface IProps {
    blockchain: Blockchain;
    blockchainInfo: IBlockchainInfo;
    account: GenericAccount;
}

interface IState {
    id: string;
    recipient: string;
    amount: number;
    feeOptions: FeeOptions;
}

export class ConfirmationPage extends Component<IProps, IState> {
    public confirmationDialog;
    public errorDialog;

    constructor(props: IProps) {
        super(props);

        const urlParams = JSON.parse(
            '{"' +
                decodeURI(
                    location.search
                        .substring(1)
                        .replace(/&/g, '","')
                        .replace(/=/g, '":"')
                ) +
                '"}'
        );

        this.state = {
            id: urlParams.id,
            recipient: urlParams.to || '',
            amount: parseFloat(urlParams.amount) || undefined,
            feeOptions: getDefaultFeeOptions(props.blockchain)
        };

        // console.log(this.state);
    }

    public render() {
        const fee = calculateFee(this.props.blockchain, this.state.feeOptions).toNumber();
        const total = this.state.amount + fee;
        return (
            <div class="confirmation-page">
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGridCell cols={12}>
                            <TextareaAutoSize
                                outlined
                                disabled
                                label="From"
                                value={this.props.account.address}
                            />
                        </LayoutGridCell>
                        <LayoutGridCell cols={12}>
                            <TextareaAutoSize
                                outlined
                                disabled
                                label={translate('App.labels.recipient')}
                                value={this.state.recipient}
                            />
                        </LayoutGridCell>
                        <LayoutGridCell cols={12}>
                            <TextareaAutoSize
                                outlined
                                disabled
                                label={
                                    translate('App.labels.amount') +
                                    ' (' +
                                    this.props.blockchainInfo.coin +
                                    ')'
                                }
                                value={this.state.amount ? String(this.state.amount) : ''}
                            />
                        </LayoutGridCell>

                        <LayoutGridCell cols={12}>
                            <Typography body2>Gas Fee </Typography>
                            <Typography body2 style="float:right">
                                {fee + ' ' + this.props.blockchainInfo.coin}
                            </Typography>
                        </LayoutGridCell>

                        <LayoutGridCell cols={12}>
                            <Typography headline6>Total </Typography>
                            <Typography headline6 style="float:right">
                                {total + ' ' + this.props.blockchainInfo.coin}
                            </Typography>
                        </LayoutGridCell>

                        <LayoutGridCell desktopCols={6} tabletCols={4} phoneCols={2}>
                            <Button
                                ripple
                                raised
                                onClick={this.onRejectClick.bind(this)}
                                className="button reject"
                            >
                                Reject
                            </Button>
                        </LayoutGridCell>
                        <LayoutGridCell
                            desktopCols={6}
                            tabletCols={4}
                            phoneCols={2}
                            className="right-text"
                        >
                            <Button
                                ripple
                                raised
                                secondary
                                onClick={this.onConfirmClick.bind(this)}
                                className="button confirm"
                            >
                                <Translate text="App.labels.confirm" />
                            </Button>
                        </LayoutGridCell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        );
    }

    public async onRejectClick() {
        // console.log('Clicked reject');

        await browser.runtime.sendMessage({
            id: this.state.id,
            type: 'MOONLET_SEND_RESPONSE',
            result: 'REJECT'
        });

        window.close();
    }

    public async onConfirmClick() {
        // console.log('Clicked confirm');
        try {
            const nonce = await this.props.account.getNonce();
            const amount = new BigNumber(this.state.amount);
            const tx = this.props.account.buildTransferTransaction(
                this.state.recipient,
                convertUnit(
                    this.props.blockchain,
                    amount,
                    this.props.blockchainInfo.coin,
                    this.props.blockchainInfo.defaultUnit
                ).toNumber(),
                nonce,
                (this.state.feeOptions as IGasFeeOptions).gasPrice,
                (this.state.feeOptions as IGasFeeOptions).gasLimit
            );
            this.props.account.signTransaction(tx);
            const response = await this.props.account.send(tx);
            (tx as any).data = new Date().toLocaleString();
            // console.log(response);
            await browser.runtime.sendMessage({
                id: this.state.id,
                type: 'MOONLET_SEND_RESPONSE',
                result: 'CONFIRM',
                data: {
                    transactionId: response.txn
                }
            });
        } catch (e) {
            await browser.runtime.sendMessage({
                id: this.state.id,
                type: 'MOONLET_SEND_RESPONSE',
                result: 'ERROR',
                data: {
                    message: e.toString()
                }
            });
        } finally {
            const password = await getPassword();
            await storeWallet(password);
            window.close();
        }
    }
}
