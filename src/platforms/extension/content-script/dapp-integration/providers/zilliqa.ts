import { BLOCKCHAIN_INFO } from './../../../../../utils/blockchain/blockchain-info';
import { Communication } from './../../utils/communication/communication';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { toBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import { isBech32 } from '@zilliqa-js/util/dist/validation';

export class ZilliqaProvider {
    public middleware = {
        request: {
            use: (fn, match) => {
                /* */
            } // console.log(fn, match)
        },
        response: {
            use: (fn, match) => {
                /* */
            } // console.log(fn, match)
        }
    };
    public currentAccount: { address: string; pubkey: string };
    public currentNetwork: { chainId: number; name: string; url: string; mainNet: boolean };

    private comm: Communication;

    constructor(comm: Communication) {
        this.comm = comm;
        // comm.request();
    }

    public getAccounts(forceConsentScreen: boolean = false): Promise<string[]> {
        // console.log(this.constructor.name, 'getAccounts');
        return this.comm
            .request('DappCommunicationController', 'getDappAccounts', [
                Blockchain.ZILLIQA,
                forceConsentScreen
            ])
            .then(res => {
                // console.log(this.constructor.name, 'getAccounts', res);
                if (res.error) {
                    return Promise.reject(res.message);
                }

                const account = res.data[0];
                if (account) {
                    const { address, pubkey } = account;
                    this.currentAccount = { address, pubkey };

                    const { chainId, name, url, mainNet } = BLOCKCHAIN_INFO[
                        Blockchain.ZILLIQA
                    ].networks[account.networkId];
                    this.currentNetwork = { chainId, name, url, mainNet };
                }

                return res.data.map(({ address, pubkey }) => ({ address, pubkey }));
            });
    }

    public signMessage(message: string) {
        return this.send('SignMessage', message);
    }

    public async send(method, ...params) {
        if (method === 'CreateTransaction') {
            params[0].amount = params[0].amount.toString();
            params[0].gasPrice = params[0].gasPrice.toString();
            params[0].gasLimit = params[0].gasLimit.toString();
            params[0].toAddr = isBech32(params[0].toAddr)
                ? params[0].toAddr
                : toBech32Address(params[0].toAddr);
        }
        // console.log(method, params);

        return this.comm
            .request('DappCommunicationController', 'rpcCall', [Blockchain.ZILLIQA, method, params])
            .then(res => {
                let data = res.data;
                // console.log(res);
                if (res.error) {
                    data = {
                        jsonrpc: '2.0',
                        error: {
                            ...res
                        }
                    };
                }
                return data;
            });
    }

    public subscribe(event, subscriber) {
        throw new Error('CustomProvider does not support subscriptions.');
    }

    public unsubscribe(token) {
        throw new Error('CustomProvider does not support subscriptions.');
    }
}
