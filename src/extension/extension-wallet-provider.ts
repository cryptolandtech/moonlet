import { ExtensionBaseProvider } from './extension-base-provider';
import { BackgroundMessageController } from './types';
import { BigNumber } from 'bignumber.js';
import { IWalletProvider } from '../app/iwallet-provider';
import { Runtime } from 'webextension-polyfill-ts';

export class ExtensionWalletProvider extends ExtensionBaseProvider implements IWalletProvider {
    constructor(port: Runtime.Port) {
        super(port, BackgroundMessageController.WALLET_MANAGER);
        // this.port = browser.runtime.connect({ name: ConnectionPort.BACKGROUND } as any);
    }

    public async createWallet(mnemonics, password) {
        return this.callAction('create', [mnemonics, password]);
    }

    public async getWallet() {
        return this.callAction('get');
    }

    public async getEncryptedWallet() {
        return this.callAction('getEncrypted');
    }

    public async loadEncryptedWallet(encryptedWallet, password) {
        return this.callAction('loadEncrypted', [encryptedWallet, password]);
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
}
