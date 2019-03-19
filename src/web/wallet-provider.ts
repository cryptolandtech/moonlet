import { BigNumber } from 'bignumber.js';
import { IWalletProvider, WalletErrorCodes } from '../app/iwallet-provider';
import Wallet from 'moonlet-core/src/core/wallet';
import { NonceManager } from '../app/utils/nonce-manager';
import { Response } from '../app/utils/response';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IGasFeeOptions } from '../app/utils/blockchain/types';

export class WebWalletProvider implements IWalletProvider {
    private wallet: Wallet;

    public async createWallet(mnemonics, password) {
        this.wallet = new Wallet(mnemonics, password);
        this.wallet.loadBlockchain(
            require('moonlet-core/src/blockchain/zilliqa/class.index').default
        );
        this.wallet.loadBlockchain(
            require('moonlet-core/src/blockchain/ethereum/class.index').default
        );

        return Promise.resolve(this.wallet);
    }

    public async getWallet() {
        if (this.wallet) {
            return Promise.resolve(JSON.parse(this.wallet.toJSON()));
        }

        return Promise.reject(Response.reject(WalletErrorCodes.WALLET_NOT_FOUND));
    }

    public async lockWallet() {
        this.wallet = null;
        return Promise.resolve();
    }

    public async unlockWallet(password) {
        if (password === 'pass') {
            return Promise.resolve();
        }
        return Promise.reject(Response.reject('NOT_IMPLEMENTED'));
    }

    public async saveWallet() {
        return Promise.resolve();
    }

    public async switchNetwork(config: { [blockchain: string]: number }) {
        for (const blockchain of Object.keys(config)) {
            this.wallet.switchNetwork(blockchain as Blockchain, config[blockchain]);
        }
    }

    public async createAccount(blockchain, accountName?) {
        const account = this.wallet.createAccount(blockchain);

        if (accountName) {
            account.name = accountName;
        }

        return Promise.resolve(account);
    }

    public async importAccount(blockchain, privateKey, accountName?) {
        const account = this.wallet.importAccountByPrivateKey(blockchain, privateKey);

        if (accountName) {
            account.name = accountName;
        }

        return Promise.resolve(account);
    }

    public async isValidAddress(blockchain, address) {
        const b = this.wallet.getBlockchain(blockchain);
        const account = b.getAccounts()[0];

        return account.utils.isValidAddress(Buffer.from(address.replace(/^0x/, ''), 'hex'));
    }

    public async getBalance(blockchain, address): Promise<BigNumber> {
        const b = this.wallet.getBlockchain(blockchain);
        const account = b.getAccounts().find(acc => acc.address === address);
        if (account) {
            try {
                const balance = await account.getBalance();
                return Promise.resolve(account.utils.balanceToStd(balance));
            } catch (e) {
                return Promise.reject(
                    Response.reject(WalletErrorCodes.GENERIC_ERROR, e.message, e)
                );
            }
        }
        return Promise.reject(
            Response.reject(
                WalletErrorCodes.ACCOUNT_NOT_FOUND,
                `Account with address: ${address} was not found.`
            )
        );
    }

    public async getNonce(blockchain, address) {
        const b = this.wallet.getBlockchain(blockchain);
        const account = b.getAccounts().find(acc => acc.address === address);

        if (account) {
            try {
                const nonce = await account.getNonce();
                return Promise.resolve(nonce);
            } catch (e) {
                return Promise.reject(
                    Response.reject(WalletErrorCodes.GENERIC_ERROR, e.message, e)
                );
            }
        }
        return Promise.reject(
            Response.reject(
                WalletErrorCodes.ACCOUNT_NOT_FOUND,
                `Account with address: ${address} was not found.`
            )
        );
    }

    public async transfer(blockchain, fromAddress, toAddress, amount, feeOptions) {
        const b = this.wallet.getBlockchain(blockchain);
        const account = b.getAccounts().find(acc => acc.address === fromAddress);

        if (account) {
            try {
                const nonce = await NonceManager.getNext(account);
                const tx = account.buildTransferTransaction(
                    toAddress,
                    amount.toNumber(),
                    nonce,
                    (feeOptions as IGasFeeOptions).gasPrice,
                    (feeOptions as IGasFeeOptions).gasLimit
                );
                account.signTransaction(tx);
                const response = await account.send(tx);
                return Promise.resolve(response);
            } catch (e) {
                if (e.code) {
                    return Promise.reject(Response.reject(e));
                }
                return Promise.reject(
                    Response.reject(WalletErrorCodes.GENERIC_ERROR, e.message, e)
                );
            }
        }
        return Promise.reject(
            Response.reject(
                WalletErrorCodes.ACCOUNT_NOT_FOUND,
                `Account with address: ${fromAddress} was not found.`
            )
        );
    }
}
