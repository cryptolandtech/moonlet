import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { GenericAccount } from 'moonlet-core/src/core/account';

export class NonceManager {
    public static async getNext(account: GenericAccount, update: boolean): Promise<number> {
        const currentNonce = await NonceManager.getCurrent(account);

        let increaseUnit = 0;
        if (account.node.blockchain === Blockchain.ZILLIQA) {
            increaseUnit = 1;
        }

        if (update) {
            NonceManager.nonce.set(account.address, currentNonce + increaseUnit);
        }
        return currentNonce + increaseUnit;
    }

    public static async getCurrent(account: GenericAccount): Promise<number> {
        const remoteNonce = await account.getNonce();
        const localNonce = NonceManager.nonce.get(account.address) || 0;
        const currentNonce = Math.max(remoteNonce, localNonce);
        return currentNonce;
    }
    private static nonce: Map<string, number> = new Map();
}
