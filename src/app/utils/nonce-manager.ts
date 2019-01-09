import { GenericAccount } from 'moonlet-core/src/core/account';

export class NonceManager {
    public static async getNext(account: GenericAccount): Promise<number> {
        const currentNonce = await NonceManager.getCurrent(account);
        NonceManager.nonce.set(account, currentNonce + 1);
        return currentNonce + 1;
    }

    public static async getCurrent(account: GenericAccount): Promise<number> {
        const remoteNonce = await account.getNonce();
        const localNonce = NonceManager.nonce.get(account) || 0;
        const currentNonce = Math.max(remoteNonce, localNonce);
        return currentNonce;
    }
    private static nonce: Map<GenericAccount, number> = new Map();
}
