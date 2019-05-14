import { BgCommunicationPlugin } from './../../core/extension/bg-communication-plugin';
import {
    ILedgerHwPlugin,
    IAppInfoResponse,
    IAddressOptions,
    IAddressResponse,
    ITransactionOptions
} from '../iledger-hw-plugin';
import { Runtime } from 'webextension-polyfill-ts';
import { BackgroundMessageController } from '../../../platforms/extension/types';

export class LedgerHwPlugin extends BgCommunicationPlugin implements ILedgerHwPlugin {
    constructor(port: Runtime.Port) {
        super(port, BackgroundMessageController.LEDGER_HW_CONTROLLER);
    }

    public getAppInfo(appName: string, timeout?: number): Promise<IAppInfoResponse> {
        return this.callAction('getAppInfo', [appName, timeout]);
    }

    public detectAppOpen(appName: string): Promise<boolean> {
        return this.getAddress(appName, { index: 0 }, 5000).then(
            () => true,
            () => this.detectAppOpen(appName)
        );
    }

    public getAddress(
        appName: string,
        options: IAddressOptions,
        timeout?: number
    ): Promise<IAddressResponse> {
        return this.callAction('getAddress', [appName, options, timeout]).then(data => {
            return { ...data, ...options };
        });
    }

    public fetchAddresses(
        appName: string,
        options: IAddressOptions,
        cb: (addr: IAddressResponse) => any
    ) {
        let operationInProgress = false;
        let fetching = true;
        let shouldFetch = true;
        let currentIndex = options.index;

        const fetch = async (index, endIndex) => {
            if (shouldFetch && index < endIndex) {
                fetching = true;
                operationInProgress = true;
                const address = await this.getAddress(appName, { ...options, index });
                operationInProgress = false;
                if (typeof cb === 'function' && shouldFetch) {
                    cb(address);
                    currentIndex = index + 1;
                    fetch(currentIndex, endIndex);
                }
            } else {
                fetching = false;
            }
        };

        const delay = time => {
            return new Promise(resolve => {
                setTimeout(() => resolve(), time);
            });
        };

        fetch(currentIndex, currentIndex + 5);

        return {
            stop: async () => {
                shouldFetch = false;
                while (operationInProgress) {
                    await delay(300);
                }
            },
            more: () => {
                if (shouldFetch && !fetching) {
                    fetch(currentIndex, currentIndex + 5);
                }
            },
            isInProgress: () => fetching
        };
    }

    public signTransaction(
        appName: string,
        options: ITransactionOptions,
        timeout?: number
    ): Promise<any> {
        return this.callAction('signTransaction', [appName, options, timeout]);
    }
}
