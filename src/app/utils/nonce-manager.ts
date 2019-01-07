import { GenericAccount } from 'moonlet-core/src/core/account';

export class NonceManager {
    public static async next(account: GenericAccount): Promise<number> {
        const remoteNonce = await account.getNonce();
        const localNonce = NonceManager.nonce.get(account) || 0;

        const currentNonce = Math.min(remoteNonce, localNonce);

        NonceManager.nonce.set(account, currentNonce + 1);

        return currentNonce + 1;
    }
    private static nonce: Map<GenericAccount, number> = new Map();
}
