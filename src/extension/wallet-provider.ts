import {
    IBackgroundMessage,
    BackgroundMessageType,
    BackgroundMessageController,
    ConnectionPort
} from './types';
import { BigNumber } from 'bignumber.js';
import { IWalletProvider } from '../app/iwallet-provider';
import { browser, Runtime } from 'webextension-polyfill-ts';
import { Deferred } from '../app/utils/deferred';
import { Response } from '../app/utils/response';

const REQUEST_TIMEOUT = 8000; // ms

interface IRequestInfo {
    timeout: any;
    deferred: Deferred;
}

export class ExtensionWalletProvider implements IWalletProvider {
    public port: Runtime.Port;
    public requests: Map<string, IRequestInfo> = new Map();

    constructor() {
        this.port = browser.runtime.connect({ name: ConnectionPort.BACKGROUND } as any);
        this.port.onMessage.addListener((message: IBackgroundMessage) => {
            if (
                message.id &&
                message.type === BackgroundMessageType.RESPONSE &&
                message.response &&
                this.requests.has(message.id)
            ) {
                const requestInfo = this.requests.get(message.id);
                clearTimeout(requestInfo.timeout);

                if (message.response.error) {
                    requestInfo.deferred.reject(message.response);
                } else {
                    requestInfo.deferred.resolve(message.response.data);
                }

                this.requests.delete(message.id);
            }
        });
    }

    public async createWallet(mnemonics, password) {
        return this.callAction('create', [mnemonics, password]);
    }

    public async getWallet() {
        return this.callAction('get');
    }

    public async lockWallet() {
        return this.callAction('lock');
    }

    public async unlockWallet(password) {
        return this.callAction('unlock', [password]);
    }

    public async saveWallet() {
        return this.callAction('saveToStorage');
    }

    public async switchNetwork(config: { [blockchain: string]: number }) {
        return this.callAction('switchNetwork', [config]);
    }

    public async createAccount(blockchain, accountName?) {
        return this.callAction('createAccount', [blockchain, accountName]);
    }

    public async importAccount(blockchain, privateKey, accountName?) {
        return this.callAction('importAccount', [blockchain, privateKey, accountName]);
    }

    public async removeAccount(blockchain, address) {
        return this.callAction('removeAccount', [blockchain, address]);
    }

    public async isValidAddress(blockchain, address): Promise<BigNumber> {
        return this.callAction('isValidAddress', [blockchain, address]);
    }

    public async getBalance(blockchain, address): Promise<BigNumber> {
        return this.callAction('getBalance', [blockchain, address]).then(b => new BigNumber(b));
    }

    public async getNonce(blockchain, address) {
        return this.callAction('getNonce', [blockchain, address]);
    }

    public async transfer(blockchain, fromAddress, toAddress, amount, feeOptions) {
        return this.callAction('transfer', [
            blockchain,
            fromAddress,
            toAddress,
            amount,
            feeOptions
        ]);
    }

    private async callAction(action, params?) {
        const message: IBackgroundMessage = {
            id: Math.random()
                .toString()
                .substr(2),
            type: BackgroundMessageType.REQUEST,
            request: {
                controller: BackgroundMessageController.WALLET_MANAGER,
                action,
                params
            }
        };

        const deferred = new Deferred();
        this.requests.set(message.id, {
            timeout: this.getRequestTimeout(message, deferred),
            deferred
        });
        this.port.postMessage(message);
        return deferred.promise;
    }

    private getRequestTimeout(message, deferred: Deferred) {
        return setTimeout(() => {
            this.requests.delete(message.id);
            deferred.reject(Response.reject('REQUEST_TIMEOUT', message));
        }, REQUEST_TIMEOUT);
    }
}
