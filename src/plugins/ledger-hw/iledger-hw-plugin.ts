export interface IAppInfoResponse {
    version: string;
}

export interface IAddressOptions {
    index: number;
    derivationIndex?: number;
    path?: string;
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

    // TODO: TBD
    // signTransaction(): Promise<any>;
}
