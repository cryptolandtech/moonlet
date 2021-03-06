import { ConfirmationScreenType } from './../../confirmation-screen/iconfirmation-screen-plugin';
import { browser, Runtime } from 'webextension-polyfill-ts';
import aes from 'crypto-js/aes';
import { Response, IResponseData } from '../../../utils/response';
import { BaseWalletController } from '../base-wallet-controller';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import Wallet from 'moonlet-core/src/core/wallet';
import { NonceManager } from '../../../utils/blockchain/nonce-manager';
import BigNumber from 'bignumber.js';
import { WalletErrorCodes } from '../iwallet-plugin';

const WALLET_STORAGE_KEY = 'serializedWallet';

const rpcDummyWallet = new Wallet();
const USER_PREFERENCES_STORAGE_KEY = 'userPref';

export class WalletController extends BaseWalletController {
    public sendMessage(message) {
        return browser.runtime.sendMessage(message);
    }

    public async rpcCall(
        sender: Runtime.MessageSender,
        blockchain: Blockchain,
        method: string,
        params: any[]
    ): Promise<IResponseData> {
        // console.log('WalletController', 'rpcCall', {sender, blockchain, method, params});
        switch (method) {
            case 'CreateTransaction':
                try {
                    const txParams = params[0];

                    // check that wallet is unlocked
                    await this.rpcCheckWallet(sender, blockchain);

                    // get dapp account
                    const accountAddress = await this.rpcGetDappAccount(sender, blockchain);

                    // open confirmation screen
                    const confirmationResult = await this.confirmationScreenController.openConfirmationScreen(
                        sender,
                        ConfirmationScreenType.TRANSACTION_CONFIRMATION,
                        {
                            blockchain,
                            fromAddress: accountAddress.data,
                            toAddress: txParams.toAddr,
                            amount: txParams.amount.toString(),
                            gasPrice: txParams.gasPrice,
                            gasLimit: txParams.gasLimit,
                            data: txParams.data,
                            code: txParams.code
                        }
                    );
                    if (confirmationResult.error) {
                        throw confirmationResult;
                    }

                    // do the actual transaction
                    const account = this.wallet
                        .getBlockchain(blockchain)
                        .getAccounts()
                        .filter(acc => acc.address === accountAddress.data)[0];

                    // console.log(txParams);
                    const nonce = await NonceManager.getNext(account, false);
                    const tx = account.buildTransaction(
                        txParams.toAddr,
                        txParams.amount.toString(),
                        nonce,
                        new BigNumber(txParams.gasPrice).toNumber(),
                        new BigNumber(txParams.gasLimit).toNumber(),
                        txParams
                    );
                    // console.log(tx);

                    account.signTransaction(tx);
                    const result = await account.send(tx);
                    // update nonce
                    await NonceManager.getNext(account, true);
                    await this.saveWallet();

                    return Response.resolve({
                        jsonrpc: '2.0',
                        result: result.txn
                    });
                } catch (e) {
                    return Response.reject(
                        e.code || WalletErrorCodes.GENERIC_ERROR,
                        e.message,
                        e.data
                    );
                }
                break;
            case 'SignMessage':
                try {
                    const data = params[0];

                    // check that wallet is unlocked
                    await this.rpcCheckWallet(sender, blockchain);

                    // get dapp account
                    const accountAddress = await this.rpcGetDappAccount(sender, blockchain);

                    // open confirmation screen
                    const confirmationResult = await this.confirmationScreenController.openConfirmationScreen(
                        sender,
                        ConfirmationScreenType.SIGN_MESSAGE,
                        {
                            blockchain,
                            fromAddress: accountAddress.data,
                            data
                        }
                    );
                    if (confirmationResult.error) {
                        throw confirmationResult;
                    }

                    // do the actual transaction
                    const account = this.wallet
                        .getBlockchain(blockchain)
                        .getAccounts()
                        .filter(acc => acc.address === accountAddress.data)[0];

                    const result = account.signMessage(data);

                    return Response.resolve({
                        jsonrpc: '2.0',
                        result
                    });
                } catch (e) {
                    return Response.reject(
                        e.code || WalletErrorCodes.GENERIC_ERROR,
                        e.message,
                        e.data
                    );
                }
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

    private async rpcCheckWallet(sender: Runtime.MessageSender, blockchain: Blockchain) {
        const check = await this.checkWallet();
        if (check.error && check.code === WalletErrorCodes.WALLET_LOCKED) {
            const loginScreen = await this.confirmationScreenController.openConfirmationScreen(
                sender,
                ConfirmationScreenType.ACCOUNT_ACCESS,
                {
                    blockchain
                }
            );
            if (loginScreen.error) {
                throw loginScreen;
            }
        } else if (check.error) {
            throw check;
        }

        return check;
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

    private async rpcGetDappAccount(
        sender: Runtime.MessageSender,
        blockchain: Blockchain
    ): Promise<IResponseData> {
        const accountAddress = await this.dappAccessController.getAccount(
            sender,
            sender.tab.url,
            blockchain,
            this.wallet.getCurrentNetwork(blockchain)
        );
        if (accountAddress.error) {
            throw accountAddress;
        }

        return accountAddress;
    }
}
