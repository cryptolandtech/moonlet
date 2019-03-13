import { Blockchain } from 'moonlet-core/src/core/blockchain';

export interface ICurrency {
    [token: string]: {
        [currency: string]: number;
        lastUpdate: number;
    };
}
