import { h, Component } from 'preact';
import LayoutGrid, { LayoutGridCell } from 'preact-material-components/LayoutGrid';
import { TextareaAutoSize } from '../../../../../../components/textarea-auto-size/textarea-auto-size.components';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { calculateFee, convertUnit } from '../../../../../../utils/blockchain/utils';
import { FeeOptions, IGasFeeOptions } from '../../../../../../utils/blockchain/types';
import { IBlockchainInfo } from '../../../../../../utils/blockchain/blockchain-info';
import { translate } from '../../../../../../utils/translate';
import BigNumber from 'bignumber.js';

interface IProps {
    feeOptions: IGasFeeOptions;
    blockchain: Blockchain;
    blockchainInfo: IBlockchainInfo;

    onChange?: (feeOptions: FeeOptions) => any;
}

interface IState {
    feeOptions: IGasFeeOptions;
    gasPriceInputValue: string;
}

export class GasFee extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const gasPriceUnit = this.props.blockchainInfo.fee.config.gasPriceUnit;
        const gasPriceInputUnit = this.props.blockchainInfo.fee.config.gasPriceInputUnit;

        this.state = {
            feeOptions: props.feeOptions,
            gasPriceInputValue: convertUnit(
                props.blockchain,
                new BigNumber(props.feeOptions.gasPrice),
                gasPriceUnit,
                gasPriceInputUnit
            ).toString()
        };
    }

    public render() {
        const gasPriceInputUnit = this.props.blockchainInfo.fee.config.gasPriceInputUnit;
        const gasPriceUnit = this.props.blockchainInfo.fee.config.gasPriceUnit;

        return (
            <LayoutGrid.Inner>
                <LayoutGridCell cols={4}>
                    <TextareaAutoSize
                        outlined
                        label={translate('SendPage.TransactionFee.GasFee.gasPrice', {
                            unit: gasPriceInputUnit
                        })}
                        value={this.state.gasPriceInputValue}
                        onChange={e => {
                            this.setState({
                                gasPriceInputValue: e.target.value
                            });
                            this.onInputChange('gasPrice', {
                                target: {
                                    value: convertUnit(
                                        this.props.blockchain,
                                        new BigNumber(e.target.value),
                                        gasPriceInputUnit,
                                        gasPriceUnit
                                    ).toString()
                                }
                            });
                        }}
                    />
                </LayoutGridCell>
                <LayoutGridCell cols={4}>
                    <TextareaAutoSize
                        outlined
                        label={translate('SendPage.TransactionFee.GasFee.gasLimit')}
                        value={this.state.feeOptions.gasLimit.toString()}
                        onChange={e => this.onInputChange('gasLimit', e)}
                    />
                </LayoutGridCell>
                <LayoutGridCell cols={4} tabletCols={8}>
                    <TextareaAutoSize
                        outlined
                        label={translate('App.labels.fee')}
                        value={
                            calculateFee(this.props.blockchain, this.state.feeOptions).toString() +
                            ` ${this.props.blockchainInfo.coin}`
                        }
                        disabled
                    />
                </LayoutGridCell>
            </LayoutGrid.Inner>
        );
    }

    public onInputChange(input, e) {
        if (this.state.feeOptions[input]) {
            const feeOptions = {
                ...this.state.feeOptions,
                [input]: parseInt(e.target.value, 10)
            };
            this.setState({ feeOptions });

            if (typeof this.props.onChange === 'function') {
                this.props.onChange(this.state.feeOptions);
            }
        }
    }
}
