import { ContentScriptCommunication } from './content-script-communication';
import { FeeOptions } from '../../../app/utils/blockchain/types';
import { Response } from '../../../app/utils/response';

export class Account {
    public blockchain: string;
    public address: string;

    constructor(blockchain: string, address: string) {
        this.blockchain = blockchain;
        this.address = address;
    }

    public getBalance() {
        return this.doCall('getBalance', [this.blockchain, this.address]);
    }

    public getNonce() {
        return this.doCall('getNonce', [this.blockchain, this.address]);
    }

    public transfer(toAddress: string, amount: string, feeOptions: FeeOptions) {
        return this.doCall('transfer', [
            this.blockchain,
            this.address,
            toAddress,
            amount,
            feeOptions
        ]);
    }

    private async doCall(action: string, params: any[] = []) {
        try {
            const response = await ContentScriptCommunication.sendMessage(action, params);
            if (response.error) {
                return Promise.reject(response);
            }

            return Promise.resolve(response.data);
        } catch (e) {
            return Promise.reject(
                Response.reject(e.code || 'GENERIC_ERROR', e.message, e.data || e)
            );
        }
    }
}
