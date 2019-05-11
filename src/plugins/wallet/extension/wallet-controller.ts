import { browser } from 'webextension-polyfill-ts';
import aes from 'crypto-js/aes';
import { Response } from '../../../utils/response';
import { BaseWalletController } from '../base-wallet-controller';

const WALLET_STORAGE_KEY = 'serializedWallet';

export class WalletController extends BaseWalletController {
    public sendMessage(message) {
        return browser.runtime.sendMessage(message);
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
}
