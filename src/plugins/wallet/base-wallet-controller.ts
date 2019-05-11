import { BigNumber } from 'bignumber.js';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import Wallet from 'moonlet-core/src/core/wallet';

import aes from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import { WalletEventEmitter } from 'moonlet-core/src/core/wallet-event-emitter';
import { IExtensionMessage, ExtensionMessageType } from '../../platforms/extension/types';
import { Response } from '../../utils/response';
import { WalletErrorCodes } from './iwallet-plugin';
import { NonceManager } from '../../utils/blockchain/nonce-manager';
import { IGasFeeOptions } from '../../utils/blockchain/types';

export abstract class BaseWalletController {
    protected wallet: Wallet;
    protected password: string;

    constructor() {
        WalletEventEmitter.subscribe((type, data) => {
            this.saveWallet();
            const message: IExtensionMessage = {
                type: ExtensionMessageType.WALLET_EVENT,
                data: {
                    type,
                    data
                }
            };
            this.sendMessage(message);
        });
    }

    public abstract sendMessage(message);
    public abstract async saveWallet();

    public async createWallet(sender, mnemonics: string, password: string) {
        this.wallet = new Wallet(mnemonics);
        this.wallet.loadBlockchain(await this.loadBlockchain('zilliqa'));
        this.wallet.loadBlockchain(await this.loadBlockchain('ethereum'));

        this.password = password;
        await this.saveWallet();
        return this.getWallet();
    }

    public async getWallet() {
        const check = await this.checkWallet();
        if (check.error) {
            return check;
        }
        return Response.resolve(JSON.parse(this.wallet.toJSON())); // TODO: return a serialized version of wallet
    }

    public async getEncryptedWallet() {
        const check = await this.checkWallet();
        if (check.error) {
            return check;
        }

        const encryptedWallet = aes.encrypt(this.wallet.toJSON(), this.password).toString();
        return Response.resolve(encryptedWallet);
    }

    public async loadEncryptedWallet(sender, encryptedWallet, password) {
        // TODO: remove lazy loading
        const blockchains = await Promise.all([
            this.loadBlockchain('ethereum'),
            this.loadBlockchain('zilliqa')
        ]);

        try {
            const json = aes.decrypt(encryptedWallet, password).toString(encUtf8);
            if (json) {
                const wallet = Wallet.fromJson(json, blockchains);
                this.wallet = wallet;
                this.password = password;
                return this.getWallet();
            }
        } catch {
            /* */
        }

        return Response.reject(WalletErrorCodes.INVALID_PASSWORD);
    }

    public async changePassword(sender, oldPassword, newPassword) {
        let json = aes.decrypt(await this.loadFromStorage(), oldPassword);
        if (json) {
            json = json.toString(encUtf8);
            this.password = newPassword;
            await this.saveWallet();
            return Response.resolve();
        }

        return Response.reject(WalletErrorCodes.INVALID_PASSWORD);
    }

    public async lockWallet() {
        await this.saveWallet();
        this.wallet = null;
        this.password = undefined;
        return Response.resolve();
    }

    public async unlockWallet(sender, password: string) {
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
            const json = aes.decrypt(await this.loadFromStorage(), password).toString(encUtf8);
            if (json) {
                const wallet = Wallet.fromJson(json, blockchains);

                // check old wallet stuff
                const walletData = JSON.parse(json);
                // console.log(walletData.accounts);
                if (
                    walletData &&
                    walletData.accounts &&
                    walletData.accounts[Blockchain.ZILLIQA] &&
                    walletData.accounts[Blockchain.ZILLIQA].length === 1
                ) {
                    const oldAccount = walletData.accounts[Blockchain.ZILLIQA][0];
                    const currentAccount = wallet
                        .getBlockchain(Blockchain.ZILLIQA)
                        .getAccounts()[0];

                    if (
                        oldAccount &&
                        currentAccount &&
                        oldAccount.address.toLowerCase() !== currentAccount.address.toLowerCase()
                    ) {
                        // console.log('old wallet detected 10018', oldAccount.address, currentAccount.address);
                        this.sendMessage({
                            type: ExtensionMessageType.OLD_WALLET_DETECTED
                        });
                    } else if (oldAccount && !currentAccount) {
                        // console.log('old wallet detected testnet', oldAccount.address);
                        this.sendMessage({
                            type: ExtensionMessageType.OLD_WALLET_DETECTED
                        });
                    }
                }

                this.wallet = wallet;
                this.password = password;
                return this.getWallet();
            }
        } catch {
            /* */
        }

        return Response.reject(WalletErrorCodes.INVALID_PASSWORD);
    }

    public async createAccount(sender, blockchain: Blockchain, accountName?: string) {
        const account = this.wallet.getBlockchain(blockchain).createAccount();
        if (accountName) {
            account.name = accountName;
        }
        await this.saveWallet();
        return Response.resolve(account);
    }

    public async importAccount(
        sender,
        blockchain: Blockchain,
        privateKey: string,
        accountName?: string
    ) {
        const account = this.wallet.getBlockchain(blockchain).importAccountByPrivateKey(privateKey);
        if (accountName) {
            account.name = accountName;
        }
        await this.saveWallet();
        return Response.resolve(account);
    }

    public async removeAccount(sender, blockchain: Blockchain, address: string) {
        try {
            this.wallet.getBlockchain(blockchain).removeAccount(address);
            await this.saveWallet();
            return Response.resolve();
        } catch (e) {
            return Response.reject(WalletErrorCodes.GENERIC_ERROR);
        }
    }

    public async isValidAddress(sender, blockchain: Blockchain, address: string) {
        try {
            const b = this.wallet.getBlockchain(blockchain);
            const account = b.getAccounts()[0];

            return Response.resolve(account.utils.isValidChecksumAddress(address));
        } catch {
            return Response.resolve(false);
        }
    }

    public async switchNetwork(sender, config: { [blockchain: string]: number }) {
        for (const blockchain of Object.keys(config)) {
            this.wallet.switchNetwork(blockchain as Blockchain, config[blockchain]);
        }
        return Response.resolve(true);
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
                const nonce = await NonceManager.getNext(account, false);
                const tx = account.buildTransferTransaction(
                    toAddress,
                    new BigNumber(amount).toString(),
                    nonce,
                    (feeOptions as IGasFeeOptions).gasPrice,
                    (feeOptions as IGasFeeOptions).gasLimit
                );
                account.signTransaction(tx);
                const response = await account.send(tx);
                // update nonce
                await NonceManager.getNext(account, true);
                await this.saveWallet();
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
    protected abstract async loadFromStorage();

    protected async loadBlockchain(name: string) {
        const blockchain = require(`moonlet-core/src/blockchain/${name}/class.index`);
        if (this.wallet) {
            this.wallet.loadBlockchain(blockchain.default);
        }

        return blockchain.default;
    }

    protected async checkWallet(): Promise<{ error; code?; message?; data? }> {
        if (this.wallet && this.password) {
            return Response.resolve();
        }

        const encryptedWallet = await this.loadFromStorage();
        if (encryptedWallet) {
            return Response.reject(WalletErrorCodes.WALLET_LOCKED);
        } else {
            return Response.reject(WalletErrorCodes.WALLET_NOT_FOUND);
        }
    }
}
