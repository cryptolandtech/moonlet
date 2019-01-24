import { FeeOptions, IGasFeeOptions } from './types';
import { BLOCKCHAIN_INFO, BlockchainFeeType } from './blockchain-info';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import BigNumber from 'bignumber.js';

export const convertUnit = (
    blockchain: Blockchain,
    value: BigNumber,
    fromUnit,
    toUnit
): BigNumber => {
    if (fromUnit === toUnit) {
        return value;
    }

    const info = BLOCKCHAIN_INFO[blockchain];

    if (info) {
        if (info.units[fromUnit] && info.units[toUnit]) {
            return value.multipliedBy(info.units[fromUnit]).dividedBy(info.units[toUnit]);
        } else {
            throw new Error(`${fromUnit} or ${toUnit} is not configured as a unit.`);
        }
    } else {
        throw new Error(`Blockchain ${blockchain} is not configured.`);
    }
};

export const calculateFee = (blockchain: Blockchain, feeOptions: FeeOptions): BigNumber => {
    const blockchainInfo = BLOCKCHAIN_INFO[blockchain];
    let fee;

    switch (blockchainInfo.fee.type) {
        case BlockchainFeeType.GAS:
            const gasPriceUnit = blockchainInfo.fee.config.gasPriceUnit;
            const fo = feeOptions as IGasFeeOptions;
            fee = convertUnit(
                blockchain,
                new BigNumber(fo.gasPrice * fo.gasLimit),
                gasPriceUnit,
                blockchainInfo.coin
            );
            break;
    }
    return fee;
};

export const getDefaultFeeOptions = (blockchain: Blockchain): FeeOptions => {
    const blockchainInfo = BLOCKCHAIN_INFO[blockchain];
    return blockchainInfo.fee.config.default;
};

export const sliderValueToFeeOptions = (
    blockchain: Blockchain,
    value: number,
    currentFeeOptions: FeeOptions
): FeeOptions => {
    const blockchainInfo = BLOCKCHAIN_INFO[blockchain];
    let feeOptions;

    switch (blockchainInfo.fee.type) {
        case BlockchainFeeType.GAS:
            feeOptions = currentFeeOptions as IGasFeeOptions;
            feeOptions.gasPrice = value;
            break;
    }
    return feeOptions;
};

export const feeOptionsToSliderValue = (blockchain: Blockchain, feeOptions: FeeOptions): number => {
    const blockchainInfo = BLOCKCHAIN_INFO[blockchain];
    let value: number;

    switch (blockchainInfo.fee.type) {
        case BlockchainFeeType.GAS:
            value = ((feeOptions as IGasFeeOptions) || ({} as any)).gasPrice;
            break;
    }
    return value;
};

export const formatCurrency = (amount: number | BigNumber, coin: string): string => {
    if (amount) {
        if (typeof amount === 'number') {
            amount = new BigNumber(amount);
        }

        return `${coin} ${amount.toString()}`;
    }

    return '';
};
