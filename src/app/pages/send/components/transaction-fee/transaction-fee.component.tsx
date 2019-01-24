import { h, Component } from 'preact';
import LayoutGrid, { LayoutGridCell } from 'preact-material-components/LayoutGrid';
import { TextareaAutoSize } from '../../../../components/textarea-auto-size/textarea-auto-size.components';
import Slider from 'preact-material-components/Slider';
import Button from 'preact-material-components/Button';
import GasFee from './components/gas-fee/gas-fee.container';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IBlockchainInfo, BlockchainFeeType } from '../../../../utils/blockchain/blockchain-info';
import { FeeOptions, IGasFeeOptions } from '../../../../utils/blockchain/types';
import {
    sliderValueToFeeOptions,
    feeOptionsToSliderValue,
    calculateFee
} from '../../../../utils/blockchain/utils';
import { Translate } from '../../../../components/translate/translate.component';
import { translate } from '../../../../utils/translate';

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
    feeSliderValue: number;
    feeOptions: FeeOptions;
}

export class TransactionFee extends Component<IProps, IState> {
    public feeSliderRef: Slider;

    constructor(props: IProps) {
        super(props);

        this.state = {
            showToggleButton: this.props.blockchainInfo.fee.config.ui === 'simple',
            simpleView: this.props.blockchainInfo.fee.config.ui === 'simple',
            feeSliderValue: (props.feeOptions as IGasFeeOptions).gasPrice, // TODO: find a more generic solution,
            feeOptions: props.feeOptions
        };
    }

    public render() {
        const info = this.props.blockchainInfo;
        return (
            <LayoutGrid class="no-padding-top-bottom">
                <Translate text="App.labels.transactionFee" headline6 />
                {this.state.simpleView && (
                    <LayoutGrid.Inner>
                        <LayoutGridCell cols={8}>
                            <Slider
                                discrete
                                min={info.fee.config.default.gasPricePresets.safeLow}
                                max={info.fee.config.default.gasPricePresets.fastest}
                                value={this.state.feeSliderValue}
                                ref={el => (this.feeSliderRef = el)}
                                onChange={() =>
                                    this.feeSliderRef.getValue() &&
                                    this.setFeeSliderValue(this.feeSliderRef.getValue())
                                }
                            />

                            <div class="gas-prices">
                                {info.fee.config.default.gasPricePresets.safeLow && (
                                    <div>
                                        <Button
                                            onClick={() =>
                                                this.setFeeSliderValue(
                                                    info.fee.config.default.gasPricePresets.safeLow
                                                )
                                            }
                                        >
                                            <Translate text="SendPage.TransactionFee.cheap" />
                                        </Button>
                                    </div>
                                )}
                                {info.fee.config.default.gasPricePresets.standard && (
                                    <div className="center-text">
                                        <Button
                                            onClick={() =>
                                                this.setFeeSliderValue(
                                                    info.fee.config.default.gasPricePresets.standard
                                                )
                                            }
                                        >
                                            <Translate text="SendPage.TransactionFee.standard" />
                                        </Button>
                                    </div>
                                )}
                                {info.fee.config.default.gasPricePresets.fast && (
                                    <div className="right-text">
                                        <Button
                                            onClick={() =>
                                                this.setFeeSliderValue(
                                                    info.fee.config.default.gasPricePresets.fast
                                                )
                                            }
                                        >
                                            <Translate text="SendPage.TransactionFee.fast" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </LayoutGridCell>
                        <LayoutGridCell cols={4} tabletCols={8}>
                            <TextareaAutoSize
                                outlined
                                label={translate('App.labels.fee')}
                                value={
                                    calculateFee(
                                        this.props.blockchain,
                                        this.state.feeOptions
                                    ).toString() + ` ${this.props.blockchainInfo.coin}`
                                }
                            />
                        </LayoutGridCell>
                    </LayoutGrid.Inner>
                )}

                {!this.state.simpleView && this.getAdvancedViewComponent()}

                {this.state.showToggleButton && (
                    <Button onClick={() => this.setState({ simpleView: !this.state.simpleView })}>
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
            feeSliderValue: value,
            feeOptions // || sliderValueToFeeOptions(this.props.blockchain, value, this.state.feeOptions)
        });

        this.onFeeOptionsChange();

        if (this.feeSliderRef) {
            this.feeSliderRef.setValue(value);
        }
        // }
    }
}
