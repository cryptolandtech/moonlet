import { ConfirmationScreenPlugin } from './../../../../../plugins/confirmation-screen/extension/index';
import { DappAccessErrorCodes } from './../../../../../plugins/dapp-access/idapp-access';
import { DappAccessPlugin } from './../../../../../plugins/dapp-access/extension/index';
import { BLOCKCHAIN_INFO } from './../../../../../utils/blockchain/blockchain-info';
import { WalletPlugin } from '../../../../../plugins/wallet/extension/index';
import { BaseCommunicationController } from './base-communication-controller';
import { Runtime } from 'webextension-polyfill-ts';
import { IResponseData, Response } from '../../../../../utils/response';
import { WalletErrorCodes } from '../../../../../plugins/wallet/iwallet-plugin';

export class DappCommunicationController extends BaseCommunicationController {
    private walletPlugin: WalletPlugin;
    private dappAccessPlugin: DappAccessPlugin;
    private confirmationScreenPlugin: ConfirmationScreenPlugin;

    constructor(bgPort: Runtime.Port) {
        super('DappCommunicationController');
        this.walletPlugin = new WalletPlugin(bgPort);
        this.dappAccessPlugin = new DappAccessPlugin(bgPort);
        this.confirmationScreenPlugin = new ConfirmationScreenPlugin(bgPort);
    }

    public async rpcCall(blockchain, method, params): Promise<IResponseData> {
        blockchain = (blockchain || '').toUpperCase();
        if (!BLOCKCHAIN_INFO[blockchain]) {
            return Response.reject(
                'BLOCKCHAIN_NOT_SUPPORTED',
                `${blockchain} blockchain not supported.`
            );
        }

        try {
            // console.log('rpcCall', blockchain, method, params);
            const response = await this.walletPlugin.rpcCall(blockchain, method, params);
            return Response.resolve(response);
        } catch (e) {
            return Response.reject(e.code || 'GENERIC_ERROR', e.message, e.data);
        }
    }

    public async getDappAccounts(blockchain, forceConsentScreen: boolean = false) {
        // console.log('DappCommunicationController', 'getDappAccounts', {blockchain, forceConsentScreen});
        blockchain = blockchain.toUpperCase();
        if (!blockchain) {
            return Response.reject('BLOCKCHAIN_MANDATORY', 'Blockchain parameter is mandatory.');
        } else if (!BLOCKCHAIN_INFO[blockchain]) {
            return Response.reject(
                'BLOCKCHAIN_NOT_SUPPORTED',
                `${blockchain} blockchain is not supported.`
            );
        }

        try {
            if (forceConsentScreen) {
                throw { code: 'FORCE_CONSENT' };
            }
            const wallet = await this.walletPlugin.getWallet();
            const dappUrl = document.location.href;
            const networkId = wallet.currentNetworks[blockchain] || 0;
            const address = await this.dappAccessPlugin.getAccount(dappUrl, blockchain, networkId);
            const account = wallet.accounts[blockchain].filter(
                acc => acc.address === address && acc.node.network.network_id === networkId
            )[0];

            return Response.resolve([{ address, pubkey: account.publicKey, networkId }]);
        } catch (e) {
            switch (e.code) {
                case 'FORCE_CONSENT':
                case DappAccessErrorCodes.UNAUTHORIZED_ACCESS:
                case WalletErrorCodes.WALLET_LOCKED:
                    // todo ask for permission and return result
                    try {
                        const selectedAccount = await this.confirmationScreenPlugin.openAccountAccessScreen(
                            blockchain,
                            forceConsentScreen
                        );
                        const wallet = await this.walletPlugin.getWallet();
                        const account = wallet.accounts[blockchain].filter(
                            acc =>
                                acc.address === selectedAccount.address &&
                                acc.node.network.network_id === selectedAccount.networkId
                        )[0];
                        return Response.resolve([
                            {
                                address: selectedAccount.address,
                                pubkey: account.publicKey,
                                networkId: selectedAccount.networkId
                            }
                        ]);
                    } catch (e) {
                        return Response.reject(e.code || 'GENERIC_ERROR', e.message, e.data);
                    }
                case WalletErrorCodes.WALLET_NOT_FOUND:
                    // return an error, since user did not setup it's wallet
                    return Response.reject(e.code, 'No wallet is setup in Moonlet.');
                default:
                    return Response.reject(e.code || 'GENERIC_ERROR', e.message, e.data);
            }
        }
    }
}
