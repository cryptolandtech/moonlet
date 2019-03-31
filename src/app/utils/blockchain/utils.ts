import { INetworksOptions } from './../../data/user-preferences/state';
import { FeeOptions, IGasFeeOptions } from './types';
import { BLOCKCHAIN_INFO, BlockchainFeeType } from './blockchain-info';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import BigNumber from 'bignumber.js';
import { IState } from '../../data';
import Namicorn from 'namicorn';

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
            feeOptions = {
                ...(currentFeeOptions as IGasFeeOptions),
                gasPrice: value
            };
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

export const filterAccounts = (
    wallet,
    mainnet: boolean,
    networkOptions: INetworksOptions,
    returnDisabled?: boolean
) => {
    const accounts = [];

    if (wallet.accounts) {
        for (const blockchain in wallet.accounts) {
            if (wallet.accounts.hasOwnProperty(blockchain)) {
                if (!networkOptions[blockchain]) {
                    networkOptions[blockchain] = {};
                }
                const networkId = mainnet
                    ? networkOptions[blockchain].mainNet || 0
                    : networkOptions[blockchain].testNet || 1;
                for (const acc of wallet.accounts[blockchain]) {
                    const returnAccount = returnDisabled ? true : !acc.disabled;
                    if (returnAccount && acc.node.network.network_id === networkId) {
                        accounts.push(acc);
                    }
                }
            }
        }
    }

    return accounts;
};

export const getSwitchNetworkConfig = (testNet, networks) => {
    const config = {};
    Object.keys(BLOCKCHAIN_INFO).map(blockchain => {
        const blockchainConfig = { testNet: 1, mainNet: 0, ...(networks[blockchain] || {}) };

        config[blockchain] = testNet ? blockchainConfig.testNet : blockchainConfig.mainNet;
    });
    return config;
};

export const getAccountFromState = (state: IState, blockchain: Blockchain, address: string) => {
    let account;
    const networks = getSwitchNetworkConfig(
        state.userPreferences.testNet,
        state.userPreferences.networks
    );

    if (
        state.wallet &&
        state.wallet.data &&
        state.wallet.data.accounts &&
        state.wallet.data.accounts[blockchain]
    ) {
        account = state.wallet.data.accounts[blockchain].filter(acc => {
            return (
                !acc.disabled &&
                acc.address === address &&
                acc.node.network.network_id === networks[blockchain]
            );
        })[0];
    }

    return account;
};

export const getAddressFromName = (
    name: string,
    namicorn: Namicorn = new Namicorn({ debug: false, disableMatcher: true })
) => {
    let address: string = name;
    const middlewares = {
        eth: namicorn.middleware.ens(),
        zil: namicorn.middleware.zns(),
        rsk: namicorn.middleware.rns()
    };
    const nameService = name.split('.', 3)[2];
    namicorn.use(middlewares[nameService]);

    address = namicorn
        .resolve(name)
        .then(data => {
            if (data) {
                return data;
            } else {
                return address;
            }
        })
        .catch(error => error);

    return address;
};
