import { browser } from 'webextension-polyfill-ts';
import { WalletManager } from './wallet-manager';
import { Response } from '../../app/utils/response';

const scopes = {
    walletManager: new WalletManager()
};

browser.runtime.onMessage.addListener(message => {
    if (
        message.scope &&
        scopes[message.scope] &&
        message.action &&
        typeof scopes[message.scope][message.action] === 'function'
    ) {
        return Promise.resolve(scopes[message.scope][message.action](...(message.params || [])));
    } else {
        return Promise.resolve(Response.reject('INVALID_REQUEST'));
    }
});
