import { BgCommunicationPlugin } from './../../core/extension/bg-communication-plugin';
import { BackgroundMessageController } from '../../../platforms/extension/types';
import { BigNumber } from 'bignumber.js';
import { Runtime } from 'webextension-polyfill-ts';
import { IWalletPlugin } from '../iwallet-plugin';

export class WalletPlugin extends BgCommunicationPlugin implements IWalletPlugin {
    constructor(port: Runtime.Port) {
        super(port, BackgroundMessageController.WALLET_CONTROLLER);
        // this.port = browser.runtime.connect({ name: ConnectionPort.BACKGROUND } as any);
    }

    public async createWallet(mnemonics, password) {
        return this.callAction('createWallet', [mnemonics, password]);
    }

    public async getWallet() {
        return this.callAction('getWallet');
    }

    public async getEncryptedWallet() {
        return this.callAction('getEncryptedWallet');
    }

    public async loadEncryptedWallet(encryptedWallet, password) {
        return this.callAction('loadEncryptedWallet', [encryptedWallet, password]);
    }

    public async lockWallet() {
        return this.callAction('lockWallet');
    }

    public async unlockWallet(password) {
        return this.callAction('unlockWallet', [password]);
    }

    public async saveWallet() {
        return this.callAction('saveWallet');
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

    public async importHWAccount(blockchain, accountName, accountIndex, derivationIndex) {
        return this.callAction('importHWAccount', [
            blockchain,
            accountName,
            accountIndex,
            derivationIndex
        ]);
    }

    public async removeAccount(blockchain, address) {
        return this.callAction('removeAccount', [blockchain, address]);
    }

    public async isValidAddress(blockchain, address): Promise<boolean> {
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
}
