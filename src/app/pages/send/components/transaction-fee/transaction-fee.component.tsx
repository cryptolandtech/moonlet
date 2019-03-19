import { h, Component } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import { TextareaAutoSize } from '../../../../components/textarea-auto-size/textarea-auto-size.components';
import Button from 'preact-material-components/Button';
import GasFee from './components/gas-fee/gas-fee.container';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IBlockchainInfo, BlockchainFeeType } from '../../../../utils/blockchain/blockchain-info';
import { FeeOptions, IGasFeeOptions } from '../../../../utils/blockchain/types';
import {
    sliderValueToFeeOptions,
    feeOptionsToSliderValue,
    calculateFee,
    getDefaultFeeOptions
} from '../../../../utils/blockchain/utils';
import { Translate } from '../../../../components/translate/translate.component';
import { translate } from '../../../../utils/translate';

import './transaction-fee.scss';
import Card from 'preact-material-components/Card';
import Currency from '../../../../components/currency/currency.container';

interface IProps {
    recipient: string;
    amount: string;
    feeOptions: FeeOptions;
    blockchain: Blockchain;
    blockchainInfo: IBlockchainInfo;

    onChange: (feeOptions) => any;
}

interface IState {
    showToggleButton: boolean;
    simpleView: boolean;
    feeOptions: FeeOptions;
    presetSelection: string;
}

export class TransactionFee extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            showToggleButton: this.props.blockchainInfo.fee.config.ui === 'simple',
            simpleView: this.props.blockchainInfo.fee.config.ui === 'simple',
            feeOptions: props.feeOptions,
            presetSelection: 'standard'
        };
    }

    public render() {
        const info = this.props.blockchainInfo;

        const fee = calculateFee(this.props.blockchain, this.state.feeOptions).toNumber();

        const feeOptionsPresets = Object.keys(info.fee.config.default.gasPricePresets).filter(
            feeOption => !!info.fee.config.default.gasPricePresets[feeOption]
        );

        return (
            <LayoutGrid class="transaction-fee-component no-padding-top-bottom">
                <Translate text="App.labels.transactionFee" headline6 />
                {this.state.simpleView && (
                    <LayoutGrid.Inner>
                        {feeOptionsPresets.length > 1 &&
                            feeOptionsPresets.map(feeOptionsPreset => {
                                const feeValue = calculateFee(
                                    this.props.blockchain,
                                    sliderValueToFeeOptions(
                                        this.props.blockchain,
                                        info.fee.config.default.gasPricePresets[feeOptionsPreset],
                                        this.state.feeOptions
                                    )
                                ).toNumber();
                                return (
                                    <LayoutGrid.Cell
                                        cols={2}
                                        desktopCols={3}
                                        className={`gas-fee-preset ${
                                            feeOptionsPreset === this.state.presetSelection
                                                ? 'active'
                                                : ''
                                        }`}
                                        onClick={() => {
                                            this.setFeeSliderValue(
                                                info.fee.config.default.gasPricePresets[
                                                    feeOptionsPreset
                                                ]
                                            );
                                            this.setState({
                                                presetSelection: feeOptionsPreset
                                            });
                                        }}
                                    >
                                        <Card>
                                            <Translate
                                                className="title"
                                                text={`SendPage.TransactionFee.${feeOptionsPreset}`}
                                            />
                                            <span>
                                                {feeValue + ` ${this.props.blockchainInfo.coin}`}
                                            </span>
                                            <span class="fiat">
                                                ~{' '}
                                                <Currency
                                                    amount={feeValue}
                                                    currency={this.props.blockchainInfo.coin}
                                                    convert
                                                />
                                            </span>
                                        </Card>
                                    </LayoutGrid.Cell>
                                );
                            })}

                        {feeOptionsPresets.length <= 1 && (
                            <LayoutGrid.Cell cols={12} tabletCols={8}>
                                <TextareaAutoSize
                                    outlined
                                    label={translate('App.labels.fee')}
                                    value={fee + ` ${this.props.blockchainInfo.coin}`}
                                    helperTextInside={
                                        <span>
                                            ~{' '}
                                            <Currency
                                                amount={fee}
                                                currency={this.props.blockchainInfo.coin}
                                                convert
                                            />
                                        </span>
                                    }
                                />
                            </LayoutGrid.Cell>
                        )}
                    </LayoutGrid.Inner>
                )}

                {!this.state.simpleView && this.getAdvancedViewComponent()}

                {this.state.showToggleButton && (
                    <Button
                        onClick={() => {
                            const simpleView = !this.state.simpleView;
                            const nextState: any = {
                                simpleView
                            };

                            if (simpleView) {
                                nextState.presetSelection = 'standard';
                                nextState.feeOptions = sliderValueToFeeOptions(
                                    this.props.blockchain,
                                    info.fee.config.default.gasPricePresets.standard,
                                    getDefaultFeeOptions(this.props.blockchain)
                                );
                            }

                            this.setState(nextState);
                        }}
                    >
                        <Button.Icon>{this.state.simpleView ? 'add' : 'remove'}</Button.Icon>
                        {this.state.simpleView
                            ? translate('SendPage.TransactionFee.advanced')
                            : translate('SendPage.TransactionFee.simple')}
                    </Button>
                )}
            </LayoutGrid>
        );
    }

    public getAdvancedViewComponent() {
        switch (this.props.blockchainInfo.fee.type) {
            case BlockchainFeeType.GAS:
                return (
                    <GasFee
                        blockchain={this.props.blockchain}
                        blockchainInfo={this.props.blockchainInfo}
                        feeOptions={this.state.feeOptions}
                        onChange={feeOptions => {
                            this.setFeeSliderValue(
                                feeOptionsToSliderValue(this.props.blockchain, feeOptions),
                                feeOptions
                            );
                        }}
                    />
                );
        }

        return null;
    }

    public onFeeOptionsChange() {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(this.state.feeOptions);
        }
    }

    public setFeeSliderValue(value: number, feeOptions?: FeeOptions) {
        // if (value) {
        this.setState({
            feeOptions: sliderValueToFeeOptions(this.props.blockchain, value, this.state.feeOptions)
        });

        this.onFeeOptionsChange();
        // }
    }
}
