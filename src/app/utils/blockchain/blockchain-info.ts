import { IGasFeeOptions, IGasFeeDefaults } from './types';
import { BigNumber } from 'bignumber.js';
import { Blockchain } from 'moonlet-core/src/core/blockchain';

export enum BlockchainFeeType {
    GAS = 'GAS'
}

interface IGasFeeConfig {
    gasPriceUnit: string;
    default: IGasFeeDefaults;
}

export interface IBlockchainInfo {
    coin: string;
    defaultUnit: string;
    units: {
        [unit: string]: BigNumber;
    };

    fee: {
        type: BlockchainFeeType;
        config: IGasFeeConfig;
    };

    pagesConfig?: {
        send: {
            advancedView?: {
                enable: boolean;
                component: 'gas-fee';
            };
        };
    };
}

export const BLOCKCHAIN_INFO: {
    [blockchain: string]: IBlockchainInfo;
} = {
    [Blockchain.ETHEREUM]: {
        coin: 'ETH',
        defaultUnit: 'WEI',
        units: {
            WEI: new BigNumber(1),
            GWEI: new BigNumber(Math.pow(10, 9)),
            ETH: new BigNumber(Math.pow(10, 18))
        },
        fee: {
            type: BlockchainFeeType.GAS,
            config: {
                gasPriceUnit: 'GWEI',
                default: {
                    gasPrice: 3,
                    gasLimit: 21000,
                    gasPricePresets: {
                        safeLow: 2,
                        standard: 20,
                        fast: 40,
                        fastest: 120
                    }
                }
            }
        }
    },
    [Blockchain.ZILLIQA]: {
        coin: 'ZIL',
        defaultUnit: 'ZIL',
        units: {
            ZIL: new BigNumber(1)
        },
        fee: {
            type: BlockchainFeeType.GAS,
            config: {
                gasPriceUnit: 'ZIL',
                default: {
                    gasPrice: 1,
                    gasLimit: 10,
                    gasPricePresets: {
                        safeLow: 1,
                        standard: 1,
                        fast: undefined,
                        fastest: 10
                    }
                }
            }
        }
    }
};
