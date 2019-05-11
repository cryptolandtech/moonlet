import { h, Component } from 'preact';
import LayoutGrid, { LayoutGridCell } from 'preact-material-components/LayoutGrid';
import { TextareaAutoSize } from '../../../../../../components/textarea-auto-size/textarea-auto-size.components';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { calculateFee, convertUnit } from '../../../../../../../utils/blockchain/utils';
import { FeeOptions, IGasFeeOptions } from '../../../../../../../utils/blockchain/types';
import { IBlockchainInfo } from '../../../../../../../utils/blockchain/blockchain-info';
import { translate } from '../../../../../../utils/translate';
import BigNumber from 'bignumber.js';
import Currency from '../../../../../../components/currency/currency.container';

interface IProps {
    feeOptions: IGasFeeOptions;
    blockchain: Blockchain;
    blockchainInfo: IBlockchainInfo;

    onChange?: (feeOptions: FeeOptions) => any;
}

interface IState {
    gasPrice: {
        value: string;
        error: string;
    };
    gasLimit: {
        value: string;
        error: string;
    };
}

export class GasFee extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const gasPriceUnit = this.props.blockchainInfo.fee.config.gasPriceUnit;
        const gasPriceInputUnit = this.props.blockchainInfo.fee.config.gasPriceInputUnit;

        this.state = {
            gasLimit: {
                value: (props.feeOptions.gasLimit || '').toString(),
                error: undefined
            },
            gasPrice: {
                value: convertUnit(
                    props.blockchain,
                    new BigNumber(props.feeOptions.gasPrice),
                    gasPriceUnit,
                    gasPriceInputUnit
                ).toString(),
                error: undefined
            }
        };
    }

    public render() {
        const gasPriceInputUnit = this.props.blockchainInfo.fee.config.gasPriceInputUnit;

        return (
            <LayoutGrid.Inner>
                <LayoutGridCell cols={4}>
                    <TextareaAutoSize
                        outlined
                        label={translate('SendPage.TransactionFee.GasFee.gasPrice', {
                            unit: gasPriceInputUnit
                        })}
                        helperText={this.state.gasPrice.error}
                        helperTextValidationMsg={!!this.state.gasPrice.error}
                        value={this.state.gasPrice.value}
                        onChange={e => {
                            this.setState({
                                gasPrice: {
                                    ...this.state.gasPrice,
                                    value: e.target.value
                                }
                            });
                            this.validate();
                            this.sendUpdates();
                        }}
                    />
                </LayoutGridCell>
                <LayoutGridCell cols={4}>
                    <TextareaAutoSize
                        outlined
                        label={translate('SendPage.TransactionFee.GasFee.gasLimit')}
                        value={this.state.gasLimit.value}
                        helperText={this.state.gasLimit.error}
                        helperTextValidationMsg={!!this.state.gasLimit.error}
                        onChange={e => {
                            this.setState({
                                gasLimit: {
                                    ...this.state.gasLimit,
                                    value: e.target.value
                                }
                            });
                            this.validate();
                            this.sendUpdates();
                        }}
                    />
                </LayoutGridCell>
                <LayoutGridCell cols={4} tabletCols={8}>
                    <TextareaAutoSize
                        outlined
                        label={translate('App.labels.fee')}
                        value={this.getTotal()}
                        helperTextInside={
                            <span>
                                ~{' '}
                                <Currency
                                    amount={calculateFee(
                                        this.props.blockchain,
                                        this.getFeeOptions()
                                    )}
                                    currency={this.props.blockchainInfo.coin}
                                    convert
                                />
                            </span>
                        }
                        disabled
                    />
                </LayoutGridCell>
            </LayoutGrid.Inner>
        );
    }

    public getTotal(): string {
        const feeOptions = this.getFeeOptions();
        if (feeOptions) {
            return (
                calculateFee(this.props.blockchain, feeOptions).toString() +
                ` ${this.props.blockchainInfo.coin}`
            );
        }

        return '';
    }

    public getFeeOptions(): FeeOptions {
        if (this.isValid()) {
            const gasPriceInputUnit = this.props.blockchainInfo.fee.config.gasPriceInputUnit;
            const gasPriceUnit = this.props.blockchainInfo.fee.config.gasPriceUnit;
            return {
                gasLimit: parseInt(this.state.gasLimit.value, 10),
                gasPrice: convertUnit(
                    this.props.blockchain,
                    new BigNumber(parseInt(this.state.gasPrice.value, 10)),
                    gasPriceInputUnit,
                    gasPriceUnit
                ).toNumber()
            };
        }
        return undefined;
    }

    public validate(showErrors: boolean = true) {
        let valid = true;
        const gasPriceValue = parseInt(this.state.gasPrice.value, 10);
        const gasLimitValue = parseInt(this.state.gasLimit.value, 10);
        let gasPriceError;
        let gasLimitError;

        if (isNaN(gasPriceValue) || gasPriceValue <= 0) {
            valid = false;
            gasPriceError = translate('SendPage.errors.invalidValue');
        }

        if (isNaN(gasLimitValue) || gasLimitValue <= 0) {
            valid = false;
            gasLimitError = translate('SendPage.errors.invalidValue');
        }

        if (showErrors) {
            this.setState({
                gasPrice: {
                    ...this.state.gasPrice,
                    error: gasPriceError
                },
                gasLimit: {
                    ...this.state.gasLimit,
                    error: gasLimitError
                }
            });
        }

        return valid;
    }

    public isValid() {
        return this.validate(false);
    }

    public sendUpdates() {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(this.getFeeOptions());
        }
    }
}
