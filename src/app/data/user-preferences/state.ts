import { Blockchain } from 'moonlet-core/src/core/blockchain';

export interface INetworksOptions {
    [blockchain: string]: {
        mainNet?: number;
        testNet?: number;
    };
}

export interface IUserPreferences {
    devMode: boolean;
    testNet: boolean;
    networks: INetworksOptions;
    preferredCurrency: string;
    disclaimerVersionAccepted?: number;
    xsellDashboardLastDismiss?: number;
}
