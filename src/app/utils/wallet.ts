import { isExtension } from './platform-utils';
import { browser } from 'webextension-polyfill-ts';
import Wallet from 'moonlet-core/src/core/wallet';
import { Blockchain } from 'moonlet-core/src/core/blockchain';

import aes from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

let wallet: Wallet;

export const WALLET_STORAGE_KEY = 'serializedWallet';

export const decodeWallet = (json: string) => {
    wallet = Wallet.fromJson(json);
    return wallet;
};

export const setWallet = (w: Wallet) => {
    wallet = w;
};

export const restoreWallet = (encryptedWallet: string, password: string): Wallet => {
    const json = aes.decrypt(encryptedWallet, password).toString(encUtf8);
    const w = Wallet.fromJson(json);
    setWallet(w);
    return w;
};

export const storeWallet = (password: string) => {
    if (isExtension() && wallet) {
        const encryptedWallet = aes.encrypt(wallet.toJSON(), password).toString();
        browser.storage.local.set({
            [WALLET_STORAGE_KEY]: {
                json: encryptedWallet
            }
        });
    }
};

export const createWallet = (
    mnemonics?: string,
    language?: string,
    mnemonicPassword?: string
): Wallet => {
    const w = new Wallet(mnemonics, language, mnemonicPassword);
    w.createAccount(Blockchain.ETHEREUM);
    w.createAccount(Blockchain.ZILLIQA);
    setWallet(w);
    return w;
};

export const getWallet = (): Wallet => {
    return wallet;
};

export const clearWallet = async () => {
    await removePassword();
    wallet = undefined;
};

export const savePassword = (password: string) => {
    // TODO hash the pass
    if (isExtension()) {
        browser.runtime.sendMessage({ method: 'setPasswordHash', hash: password });
    }
};

export const removePassword = () => {
    if (isExtension()) {
        return browser.runtime.sendMessage({ method: 'removePasswordHash' });
    }
    return Promise.resolve();
};

export const getPassword = () => {
    if (isExtension()) {
        return browser.runtime.sendMessage({ method: 'getPasswordHash' });
    }
};

export const checkPassword = async (password: string) => {
    if (isExtension()) {
        const passwordHash = await browser.runtime.sendMessage({ method: 'getPasswordHash' });
        return passwordHash === password;
    }
};
