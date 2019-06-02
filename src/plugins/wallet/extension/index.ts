import { BgCommunicationPlugin } from './../../core/extension/bg-communication-plugin';
import {
    BackgroundMessageController,
    IBackgroundMessage
} from '../../../platforms/extension/types';
import { BigNumber } from 'bignumber.js';
import { Runtime } from 'webextension-polyfill-ts';
import { IWalletPlugin } from '../iwallet-plugin';
import { HWDevice } from 'moonlet-core/src/core/account';
import { Blockchain } from 'moonlet-core/src/core/blockchain';

export class WalletPlugin extends BgCommunicationPlugin implements IWalletPlugin {
    constructor(port: Runtime.Port) {
        super(port, BackgroundMessageController.WALLET_CONTROLLER);
        // this.port = browser.runtime.connect({ name: ConnectionPort.BACKGROUND } as any);
    }

    public generateMnemonics(): Promise<string> {
        return this.callAction('generateMnemonics');
    }

    public validateMnemonics(mnemonic: string): Promise<boolean> {
        return this.callAction('validateMnemonics', [mnemonic]);
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

    public async importHWAccount(
        deviceType: HWDevice,
        blockchain: Blockchain,
        accountName: string,
        derivationPath: string,
        address: string,
        accountIndex: string,
        derivationIndex: string
    ) {
        return this.callAction('importHWAccount', [
            deviceType,
            blockchain,
            accountName,
            derivationPath,
            address,
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
        return this.callAction(
            'transfer',
            [blockchain, fromAddress, toAddress, amount, feeOptions],
            5 * 60 * 1000
        );
    }

    protected sanitizeMessageForErrorReporting(message: IBackgroundMessage) {
        const msg = { ...message };

        delete msg.id;

        switch (msg.request.action) {
            case 'validateMnemonics':
                msg.request.params = ['*mnemonic*'];
                break;
            case 'createWallet':
                msg.request.params = ['*mnemonic*', '*password*'];
                break;
            case 'loadEncryptedWallet':
                msg.request.params = ['*encryptedWallet*', '*password*'];
                break;
            case 'unlockWallet':
                msg.request.params = ['*password*'];
                break;
        }
        return msg;
    }
}
