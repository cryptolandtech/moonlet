import { BigNumber } from 'bignumber.js';
import { IGasFeeOptions } from './../../app/utils/blockchain/types';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { browser } from 'webextension-polyfill-ts';
import Wallet from 'moonlet-core/src/core/wallet';

import aes from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import { NonceManager } from '../../app/utils/nonce-manager';
import { Response } from '../../app/utils/response';
import { WalletErrorCodes } from '../../app/iwallet-provider';

const WALLET_STORAGE_KEY = 'serializedWallet';

// fix chain id
// import networksZil from 'moonlet-core/src/blockchain/zilliqa/networks';
// networksZil[0].chainId = 62;

export class WalletManager {
    private wallet: Wallet;
    private password: string;

    public async create(sender, mnemonics: string, password: string) {
        this.wallet = new Wallet(mnemonics);
        this.wallet.loadBlockchain(await this.loadBlockchain('zilliqa'));
        this.wallet.loadBlockchain(await this.loadBlockchain('ethereum'));

        this.wallet.createAccount(Blockchain.ZILLIQA);

        this.password = password;
        await this.saveToStorage();
        return this.get();
    }

    public async get() {
        const check = await this.checkWallet();
        if (check.error) {
            return check;
        }

        return Response.resolve(JSON.parse(this.wallet.toJSON())); // TODO: return a serialized version of wallet
    }

    public async changePassword(sender, oldPassword, newPassword) {
        let json = aes.decrypt(await this.getFromStorage(), oldPassword);
        if (json) {
            json = json.toString(encUtf8);
            this.password = newPassword;
            await this.saveToStorage();
            return Response.resolve();
        }

        return Response.reject(WalletErrorCodes.INVALID_PASSWORD);
    }

    public async lock() {
        await this.saveToStorage();
        this.wallet = null;
        this.password = undefined;
        return Response.resolve();
    }

    public async unlock(sender, password: string) {
        const check = await this.checkWallet();
        if (check.error && check.code !== WalletErrorCodes.WALLET_LOCKED) {
            return check;
        }

        // TODO: remove lazy loading
        const blockchains = await Promise.all([
            this.loadBlockchain('ethereum'),
            this.loadBlockchain('zilliqa')
        ]);

        try {
            const json = aes.decrypt(await this.getFromStorage(), password).toString(encUtf8);
            if (json) {
                const wallet = Wallet.fromJson(json, blockchains);
                this.wallet = wallet;
                this.password = password;
                return this.get();
            }
        } catch {
            /* */
        }

        return Response.reject(WalletErrorCodes.INVALID_PASSWORD);
    }

    public async saveToStorage() {
        const check = await this.checkWallet();
        if (check.error) {
            return check;
        }

        const encryptedWallet = aes.encrypt(this.wallet.toJSON(), this.password).toString();
        browser.storage.local.set({
            [WALLET_STORAGE_KEY]: {
                json: encryptedWallet
            }
        });
        return Response.resolve();
    }

    public async createAccount(sender, blockchain: Blockchain) {
        const account = this.wallet.getBlockchain(blockchain).createAccount();
        return Response.resolve(account);
    }

    public async isValidAddress(sender, blockchain: Blockchain, address: string) {
        try {
            const b = this.wallet.getBlockchain(blockchain);
            const account = b.getAccounts()[0];
            const add = Buffer.from(address.replace(/^0x/, ''), 'hex');
            return Response.resolve(account.utils.isValidAddress(add));
        } catch {
            return Response.resolve(false);
        }
    }

    public async switchNetwork(config: { [blockchain: string]: number }) {
        for (const blockchain of Object.keys(config)) {
            this.wallet.switchNetwork(blockchain as Blockchain, config[blockchain]);
        }
    }

    public async getBalance(sender, blockchain: Blockchain, address: string) {
        const b = this.wallet.getBlockchain(blockchain);
        const account = b.getAccounts().find(acc => acc.address === address);

        if (account) {
            try {
                const balance = await account.getBalance();
                return Response.resolve(account.utils.balanceToStd(balance));
            } catch (e) {
                return Response.reject(WalletErrorCodes.GENERIC_ERROR, e.message, e);
            }
        }
        return Response.reject(
            WalletErrorCodes.ACCOUNT_NOT_FOUND,
            `Account with address: ${address} was not found.`
        );
    }

    public async getNonce(sender, blockchain: Blockchain, address: string) {
        const b = this.wallet.getBlockchain(blockchain);
        const account = b.getAccounts().find(acc => acc.address === address);

        if (account) {
            try {
                const nonce = await NonceManager.getCurrent(account);
                return Response.resolve(nonce);
            } catch (e) {
                return Response.reject(WalletErrorCodes.GENERIC_ERROR, e.message, e);
            }
        }
        return Response.reject(
            WalletErrorCodes.ACCOUNT_NOT_FOUND,
            `Account with address: ${address} was not found.`
        );
    }

    public async transfer(
        sender,
        blockchain: Blockchain,
        fromAddress: string,
        toAddress: string,
        amount: string,
        feeOptions
    ) {
        const b = this.wallet.getBlockchain(blockchain);
        const account = b.getAccounts().find(acc => acc.address === fromAddress);

        if (account) {
            try {
                const nonce = await NonceManager.getNext(account);
                const tx = account.buildTransferTransaction(
                    toAddress,
                    new BigNumber(amount).toNumber(),
                    nonce,
                    (feeOptions as IGasFeeOptions).gasLimit,
                    (feeOptions as IGasFeeOptions).gasPrice
                );
                account.signTransaction(tx);
                const response = await account.send(tx);
                await this.saveToStorage();
                return Response.resolve(response);
            } catch (e) {
                if (e.code) {
                    return Response.reject(e);
                }
                return Response.reject(WalletErrorCodes.GENERIC_ERROR, e.message, e);
            }
        }
        return Response.reject(
            WalletErrorCodes.ACCOUNT_NOT_FOUND,
            `Account with address: ${fromAddress} was not found.`
        );
    }

    private async loadBlockchain(name: string) {
        const blockchain = require(`moonlet-core/src/blockchain/${name}/class.index`);
        if (this.wallet) {
            this.wallet.loadBlockchain(blockchain.default);
        }

        return blockchain.default;
    }

    private async getFromStorage() {
        const storage = await browser.storage.local.get();
        return storage[WALLET_STORAGE_KEY] && storage[WALLET_STORAGE_KEY].json;
    }

    private async checkWallet(): Promise<{ error; code?; message?; data? }> {
        if (this.wallet && this.password) {
            return Response.resolve();
        }

        const encryptedWallet = await this.getFromStorage();
        if (encryptedWallet) {
            return Response.reject(WalletErrorCodes.WALLET_LOCKED);
        } else {
            return Response.reject(WalletErrorCodes.WALLET_NOT_FOUND);
        }
    }
}
