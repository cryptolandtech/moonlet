export interface IAppInfoResponse {
    version: string;
}

export interface IAddressOptions {
    index: number;
    derivationIndex?: number;
    path?: string;
}

export interface ITransactionOptions {
    index: number;
    derivationIndex?: number;
    path?: string;
    txRaw: string;
}

export interface IAddressResponse {
    address: string;
    index: number;
    derivationIndex: number;
    path: string;
}

export interface ILedgerHwPlugin {
    getAppInfo(appName: string, timeout?: number): Promise<IAppInfoResponse>;
    detectAppOpen(appName: string): Promise<boolean>;
    getAddress(
        appName: string,
        options: IAddressOptions,
        timeout?: number
    ): Promise<IAddressResponse>;
    fetchAddresses(appName: string, options: IAddressOptions, cb: (addr: IAddressResponse) => any);

    signTransaction(appName: string, options: ITransactionOptions, timeout?: number): Promise<any>;
}
