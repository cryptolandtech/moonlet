import { BgCommunicationPlugin } from './../../core/extension/bg-communication-plugin';
import {
    ILedgerHwPlugin,
    IAppInfoResponse,
    IAddressOptions,
    IAddressResponse
} from '../iledger-hw-plugin';
import { Runtime } from 'webextension-polyfill-ts';
import { BackgroundMessageController } from '../../../platforms/extension/types';

export class LedgerHwPlugin extends BgCommunicationPlugin implements ILedgerHwPlugin {
    constructor(port: Runtime.Port) {
        super(port, BackgroundMessageController.LEDGER_HW_CONTROLLER);
    }

    public getAppInfo(appName: string): Promise<IAppInfoResponse> {
        return this.callAction('getAppInfo', [appName]);
    }

    public getAddress(appName: string, options: IAddressOptions): Promise<IAddressResponse> {
        return this.callAction('getAddress', [appName, options]);
    }
}
