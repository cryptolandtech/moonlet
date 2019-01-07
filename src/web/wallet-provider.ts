import { BigNumber } from 'bignumber.js';
import { IWalletProvider, WalletErrorCodes } from '../app/iwallet-provider';
import Wallet from 'moonlet-core/src/core/wallet';
import { NonceManager } from '../app/utils/nonce-manager';
import { Response } from '../app/utils/response';

// set testnets
import networksEth from 'moonlet-core/src/blockchain/ethereum/networks';
networksEth[0] = networksEth[2];
import networksZil from 'moonlet-core/src/blockchain/zilliqa/networks';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IGasFeeOptions } from '../app/utils/blockchain/types';
networksZil[0] = networksZil[1];
networksZil[0].network_id = 0;
networksZil[0].url = 'https://api.zilliqa.com';
// networksZil[0].url = 'http://localhost:4200';
// createWallet("kid patch sample either echo supreme hungry ketchup hero away ice alcohol");

export class WebWalletProvider implements IWalletProvider {
    private wallet: Wallet;

    public async createWallet(mnemonics, password) {
        this.wallet = new Wallet(mnemonics, password);

        this.wallet.loadBlockchain(await this.loadBlockchain('zilliqa'));
        this.wallet.loadBlockchain(await this.loadBlockchain('ethereum'));

        this.wallet.createAccount(Blockchain.ZILLIQA);

        return this.getWallet();
    }

    public async getWallet() {
        if (this.wallet) {
            return Promise.resolve(JSON.parse(this.wallet.toJSON()));
        } else {
            Promise.reject(Response.reject(WalletErrorCodes.WALLET_NOT_FOUND));
        }
    }

    public async lockWallet() {
        this.wallet = null;
        return Promise.resolve();
    }

    public async unlockWallet(password) {
        return Promise.reject(Response.reject('NOT_IMPLEMENTED'));
    }

    public async saveWallet() {
        return Promise.reject(Response.reject('NOT_IMPLEMENTED'));
    }

    public async createAccount(blockchain) {
        const account = this.wallet.createAccount(blockchain);
        return Promise.resolve(account);
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
                const nonce = await NonceManager.next(account);
                const tx = account.buildTransferTransaction(
                    toAddress,
                    amount.toNumber(),
                    nonce,
                    (feeOptions as IGasFeeOptions).gasLimit,
                    (feeOptions as IGasFeeOptions).gasPrice
                );
                account.signTransaction(tx);
                const response = await account.send(tx);
                (tx as any).data = new Date().toLocaleString();
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

    private async loadBlockchain(name: string) {
        const blockchain = await await import(/* webpackChunkName: "blockchain/[request]" */ `moonlet-core/src/blockchain/${name}/class.index`);
        if (this.wallet) {
            this.wallet.loadBlockchain(blockchain.default);
        }

        return blockchain.default;
    }
}
