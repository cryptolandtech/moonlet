import { browser } from 'webextension-polyfill-ts';
import aes from 'crypto-js/aes';
import { Response, IResponseData } from '../../../utils/response';
import { BaseWalletController } from '../base-wallet-controller';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import Wallet from 'moonlet-core/src/core/wallet';
import { NonceManager } from '../../../utils/blockchain/nonce-manager';
import BigNumber from 'bignumber.js';

const WALLET_STORAGE_KEY = 'serializedWallet';

const rpcDummyWallet = new Wallet();
const USER_PREFERENCES_STORAGE_KEY = 'userPref';

export class WalletController extends BaseWalletController {
    public sendMessage(message) {
        return browser.runtime.sendMessage(message);
    }

    public async rpcCall(
        sender,
        blockchain: Blockchain,
        method: string,
        params: any[]
    ): Promise<IResponseData> {
        switch (method) {
            case 'CreateTransaction':
                const t = params[0];
                const account = this.wallet
                    .getBlockchain(blockchain)
                    .getAccounts()
                    .filter(acc => acc.address === t.pubKey)[0];
                const nonce = await NonceManager.getNext(account, false);
                const tx = account.buildTransferTransaction(
                    t.toAddr,
                    t.amount.toString(),
                    nonce,
                    new BigNumber(t.gasPrice).toNumber(),
                    new BigNumber(t.gasLimit).toNumber()
                );

                account.signTransaction(tx);
                await account.send(tx);

                return Response.resolve(await account.send(tx));
                break;
            default:
                try {
                    const node = await this.getNodeForRpc(blockchain);
                    const response = await node.rpcCallRaw(method, params);
                    return Response.resolve({
                        ...response.data,
                        req: JSON.parse(response.config.data)
                    });
                } catch (e) {
                    return Response.reject('GENERIC_ERROR', '', e);
                }
        }
    }

    public async saveWallet() {
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

    protected async loadFromStorage() {
        const storage = await browser.storage.local.get();
        return storage[WALLET_STORAGE_KEY] && storage[WALLET_STORAGE_KEY].json;
    }

    private async getNodeForRpc(blockchain: Blockchain) {
        // TODO: ugly solutions, needs refactoring
        if (this.wallet) {
            return this.wallet.getNode(blockchain);
        }

        const storage = await browser.storage.local.get(USER_PREFERENCES_STORAGE_KEY);
        let networkId = 0;
        if (
            storage &&
            storage.userPref &&
            storage.userPref.networks &&
            storage.userPref.networks[blockchain]
        ) {
            networkId = storage.userPref.testNet
                ? storage.userPref.networks[blockchain].testNet
                : storage.userPref.networks[blockchain].mainNet;
        }
        rpcDummyWallet.loadBlockchain(await this.loadBlockchain(blockchain.toLowerCase()));
        rpcDummyWallet.switchNetwork(blockchain, networkId);
        return rpcDummyWallet.getNode(blockchain);
    }
}
