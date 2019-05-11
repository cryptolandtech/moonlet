export interface IAppInfoResponse {
    version: string;
}

export interface IAddressOptions {
    index: number;
    derivationIndex?: number;
    legacyPath?: boolean;
}

export interface IAddressResponse {
    address: string;
}

export interface ILedgerHwPlugin {
    getAppInfo(appName: string, timeout?: number): Promise<IAppInfoResponse>;
    getAddress(
        appName: string,
        options: IAddressOptions,
        timeout?: number
    ): Promise<IAddressResponse>;

    // TODO: TBD
    // signTransaction(): Promise<any>;
}
