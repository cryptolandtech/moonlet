import { isExtension } from './platform-utils';
import { browser } from 'webextension-polyfill-ts';
import Wallet from 'moonlet-core/src/core/wallet';
import { Blockchain } from 'moonlet-core/src/core/blockchain';

import aes from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

let wallet: Wallet;

export const WALLET_STORAGE_KEY = 'serializedWallet';

export const setWallet = (w: Wallet) => {
    wallet = w;
};

export const loadBlockchain = async (name: string) => {
    const blockchain = await import(/* webpackChunkName: "blockchain/[request]" */ `moonlet-core/src/blockchain/${name}/class.index`);
    wallet.loadBlockchain(blockchain.default);
    return blockchain.default;
};

export const createWallet = (
    mnemonics?: string,
    language?: string,
    mnemonicPassword?: string
): Promise<Wallet> => {
    return new Promise(async (resolve, reject) => {
        try {
            const w = new Wallet(mnemonics, language, mnemonicPassword);
            setWallet(w);
            await Promise.all([loadBlockchain('ethereum'), loadBlockchain('zilliqa')]);

            w.createAccount(Blockchain.ETHEREUM);
            w.createAccount(Blockchain.ZILLIQA);

            resolve(w);
        } catch (e) {
            reject(e);
        }
    });
};

export const restoreWallet = (encryptedWallet: string, password: string): Promise<Wallet> => {
    const json = aes.decrypt(encryptedWallet, password).toString(encUtf8);
    const w = Wallet.fromJson(json);
    setWallet(w);
    return Promise.resolve(w);
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

export const getWallet = (): Wallet => {
    return wallet;
};

export const clearWallet = async () => {
    await removePassword();
    wallet = undefined;
};

// TODO: function bellow should be moved in a separate file
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
