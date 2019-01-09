import { browser } from 'webextension-polyfill-ts';
import { WalletManager } from './wallet-manager';
import { Response } from '../../app/utils/response';
import { RemoteInterface } from './remote-interface';

const walletManager = new WalletManager();
const remoteInterface = new RemoteInterface(walletManager);

const scopes = {
    walletManager,
    remoteInterface
};

browser.runtime.onMessage.addListener((message, sender) => {
    // accept messages only from moonlet extension
    if (sender.id !== browser.runtime.id) {
        return Promise.reject('INVALID_REQUEST');
    }

    if (
        message.scope &&
        scopes[message.scope] &&
        message.action &&
        typeof scopes[message.scope][message.action] === 'function'
    ) {
        return Promise.resolve(
            scopes[message.scope][message.action](sender, ...(message.params || []))
        );
    } else {
        return Promise.resolve(Response.reject('INVALID_REQUEST'));
    }
});
