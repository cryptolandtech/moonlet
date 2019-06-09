import { BLOCKCHAIN_INFO } from './../../../../../utils/blockchain/blockchain-info';
import { Communication } from './../../utils/communication/communication';
import { Blockchain } from 'moonlet-core/src/core/blockchain';

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
    public currentAccount;
    public currentNetwork;

    private comm: Communication;

    constructor(comm: Communication) {
        this.comm = comm;
        // comm.request();
    }

    public getAccounts(forceConsentScreen: boolean = false): Promise<string[]> {
        return this.comm
            .request('DappCommunicationController', 'getDappAccounts', [
                Blockchain.ZILLIQA,
                forceConsentScreen
            ])
            .then(res => {
                if (res.error) {
                    return Promise.reject(res.message);
                }

                const account = res.data[0];
                if (account) {
                    this.currentAccount = account.address;
                    this.currentNetwork =
                        BLOCKCHAIN_INFO[Blockchain.ZILLIQA].networks[account.networkId].chainId;
                }

                return res.data.map(acc => acc.address);
            });
    }

    public async send(method, ...params) {
        if (method === 'CreateTransaction') {
            params[0].amount = params[0].amount.toString();
            params[0].gasPrice = params[0].gasPrice.toString();
            params[0].gasLimit = params[0].gasLimit.toString();
        }
        // console.log(method, params);

        return this.comm
            .request('DappCommunicationController', 'rpcCall', [Blockchain.ZILLIQA, method, params])
            .then(res => {
                let data = res.data;

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
