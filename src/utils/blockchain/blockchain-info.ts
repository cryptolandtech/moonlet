import { IGasFeeDefaults } from './types';
import { BigNumber } from 'bignumber.js';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { Network } from 'moonlet-core/src/core/network';

export enum BlockchainFeeType {
    GAS = 'GAS'
}

interface IGasFeeConfig {
    gasPriceUnit: string;
    gasPriceInputUnit: string;
    default: IGasFeeDefaults;
    ui: 'simple' | 'advanced';
}

export interface IBlockchainInfo {
    coin: string;
    defaultUnit: string;
    units: {
        [unit: string]: BigNumber;
    };
    decimals: number;

    fee: {
        type: BlockchainFeeType;
        config: IGasFeeConfig;
    };
    nameResolver: string;
    hardwareWallet?: {
        ledger?: {
            appName: string;
            derivationPaths?: string[];
        };
    };
    pagesConfig?: {
        accountPage?: {
            multipleAddressFormats: boolean;
            displayFormats: string[];
        };
        send?: {
            advancedView?: {
                enable: boolean;
                component: 'gas-fee';
            };
        };
    };
    networks: Network[];
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
        decimals: 4,
        fee: {
            type: BlockchainFeeType.GAS,
            config: {
                gasPriceUnit: 'WEI',
                gasPriceInputUnit: 'GWEI',
                ui: 'simple',
                default: {
                    gasPrice: 20000000000,
                    gasLimit: 21000,
                    gasPricePresets: {
                        safeLow: 2000000000,
                        standard: 20000000000,
                        fast: 40000000000,
                        fastest: 120000000000
                    }
                }
            }
        },
        nameResolver: 'ens',
        hardwareWallet: {
            ledger: {
                appName: 'Eth',
                derivationPaths: ['live', 'legacy']
            }
        },
        networks: require('moonlet-core/src/blockchain/ethereum/networks').default
    },
    [Blockchain.ZILLIQA]: {
        coin: 'ZIL',
        defaultUnit: 'QA',
        units: {
            QA: new BigNumber(1),
            LI: new BigNumber(Math.pow(10, 6)),
            ZIL: new BigNumber(Math.pow(10, 12))
        },
        decimals: 3,
        fee: {
            type: BlockchainFeeType.GAS,
            config: {
                gasPriceUnit: 'QA',
                gasPriceInputUnit: 'LI',
                ui: 'simple',
                default: {
                    gasPrice: 1000000000,
                    gasLimit: 1,
                    gasPricePresets: {
                        safeLow: undefined,
                        standard: 1000000000,
                        fast: undefined,
                        fastest: undefined
                    }
                }
            }
        },
        nameResolver: 'ens',
        pagesConfig: {
            accountPage: {
                multipleAddressFormats: true,
                displayFormats: ['default', 'base16']
            }
        },
        hardwareWallet: {
            ledger: {
                appName: 'Zil',
                derivationPaths: []
            }
        },
        networks: require('moonlet-core/src/blockchain/zilliqa/networks').default
    }
};
