import { Component, h } from 'preact';
import { TextareaAutoSize } from '../../components/textarea-auto-size/textarea-auto-size.components';
import LayoutGrid, { LayoutGridCell } from 'preact-material-components/LayoutGrid';
import { Button } from 'preact-material-components/Button';

import './transaction-confirmation.scss';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IBlockchainInfo, BLOCKCHAIN_INFO } from '../../../utils/blockchain/blockchain-info';
import { convertUnit, getDefaultFeeOptions, calculateFee } from '../../../utils/blockchain/utils';
import { FeeOptions } from '../../../utils/blockchain/types';
import { translate } from '../../utils/translate';
import { Translate } from '../../components/translate/translate.component';
import { BigNumber } from 'bignumber.js';
import Typography from 'preact-material-components/Typography';
import { browser } from 'webextension-polyfill-ts';
import { Response } from '../../../utils/response';
import { IWalletTransfer } from '../../data/wallet/state';

interface IProps {
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
    blockchain: Blockchain;
    blockchainInfo: IBlockchainInfo;
    address: string;
    recipient: string;
    amount: BigNumber;
    feeOptions: FeeOptions;
}

export class TransactionConfirmationPage extends Component<IProps, IState> {
    public confirmationDialog;
    public errorDialog;
    public url: URL = new URL(location.href);

    constructor(props: IProps) {
        super(props);

        this.state = {
            blockchain: Blockchain.ZILLIQA,
            blockchainInfo: BLOCKCHAIN_INFO[Blockchain.ZILLIQA],
            address: '',
            recipient: '',
            amount: new BigNumber(0),
            feeOptions: {
                gasLimit: 0,
                gasPrice: 0
            }
        };

        browser.runtime
            .sendMessage({
                scope: 'remoteInterface',
                action: 'getData',
                params: [this.url.searchParams.get('id')]
            })
            .then(response =>
                this.setState({
                    blockchain: response.data.blockchain,
                    blockchainInfo: BLOCKCHAIN_INFO[response.data.blockchain],
                    address: response.data.fromAddress,
                    recipient: response.data.toAddress,
                    amount: new BigNumber(response.data.amount),
                    feeOptions: getDefaultFeeOptions(response.data.blockchain)
                })
            );
    }

    public async componentDidUpdate(prevProps: IProps) {
        if (
            prevProps.transferInfo.inProgress !== undefined &&
            prevProps.transferInfo.inProgress !== this.props.transferInfo.inProgress
        ) {
            if (this.props.transferInfo.success) {
                await browser.runtime.sendMessage({
                    scope: 'remoteInterface',
                    action: 'sendMessage',
                    params: [
                        this.url.searchParams.get('id'),
                        Response.resolve({
                            txn: this.props.transferInfo.txn
                        })
                    ]
                });
            } else {
                await browser.runtime.sendMessage({
                    scope: 'remoteInterface',
                    action: 'sendMessage',
                    params: [
                        this.url.searchParams.get('id'),
                        Response.reject('GENERIC_ERROR', this.props.transferInfo.error)
                    ]
                });
            }
            window.close();
        }
    }

    public render() {
        const fee = calculateFee(this.state.blockchain, this.state.feeOptions);
        const total = this.state.amount.plus(fee);
        return (
            <div class="transaction-confirmation-page">
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGridCell cols={12}>
                            <TextareaAutoSize
                                outlined
                                disabled
                                label={translate('App.labels.from')}
                                value={this.state.address}
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
                                    this.state.blockchainInfo.coin +
                                    ')'
                                }
                                value={this.state.amount.toString()}
                            />
                        </LayoutGridCell>

                        <LayoutGridCell cols={12}>
                            <Translate text="App.labels.fee" body2 style="float:left" />
                            <Typography body2 style="float:right">
                                {fee.toString() + ' ' + this.state.blockchainInfo.coin}
                            </Typography>
                        </LayoutGridCell>

                        <LayoutGridCell cols={12}>
                            <Translate text="App.labels.total" headline6 style="float:left" />
                            <Typography headline6 style="float:right">
                                {total.toString() + ' ' + this.state.blockchainInfo.coin}
                            </Typography>
                        </LayoutGridCell>

                        <LayoutGridCell desktopCols={6} tabletCols={4} phoneCols={2}>
                            <Button
                                ripple
                                raised
                                onClick={this.onRejectClick.bind(this)}
                                className="button reject"
                            >
                                <Translate text="App.labels.cancel" />
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
        await browser.runtime.sendMessage({
            scope: 'remoteInterface',
            action: 'sendMessage',
            params: [this.url.searchParams.get('id'), Response.reject('CANCEL')]
        });
        window.close();
    }

    public async onConfirmClick() {
        this.props.transfer(
            this.state.blockchain,
            this.state.address,
            this.state.recipient,
            convertUnit(
                this.state.blockchain,
                this.state.amount,
                this.state.blockchainInfo.coin,
                this.state.blockchainInfo.defaultUnit
            ),
            this.state.feeOptions
        );
    }
}
