import { browser } from 'webextension-polyfill-ts';

const data = {
    wallet: {
        passwordHash: undefined
    },
    timeout: undefined
};

const methods = {
    getPasswordHash,
    setPasswordHash,
    removePasswordHash
};

browser.runtime.onMessage.addListener(message => {
    // TODO check security vulnerabilities
    if (data.timeout) {
        clearTimeout(data.timeout);
    }

    if (message.method && methods[message.method]) {
        data.timeout = setTimeout(() => {
            removePasswordHash();
        }, 1 * 20 * 1000);
        return Promise.resolve(methods[message.method](message));
    } else {
        return Promise.reject('Method not not found.');
    }
});

function getPasswordHash() {
    return data.wallet.passwordHash;
}

function setPasswordHash(message) {
    if (message.hash) {
        data.wallet.passwordHash = message.hash;
    }
}

function removePasswordHash() {
    data.wallet.passwordHash = undefined;
}
