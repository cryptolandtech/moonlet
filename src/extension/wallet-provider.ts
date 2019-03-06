import { BigNumber } from 'bignumber.js';
import { IWalletProvider } from '../app/iwallet-provider';
import { browser } from 'webextension-polyfill-ts';

export class ExtensionWalletProvider implements IWalletProvider {
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

    public async createAccount(blockchain) {
        return this.callAction('createAccount', [blockchain]);
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
        const response = await browser.runtime.sendMessage({
            scope: 'walletManager',
            action,
            params
        });

        if (response.error) {
            return Promise.reject(response);
        } else {
            return Promise.resolve(response.data);
        }
    }
}
