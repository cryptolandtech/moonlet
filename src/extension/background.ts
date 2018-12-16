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
    removePasswordHash,
    send
};

browser.runtime.onMessage.addListener(message => {
    // TODO check security vulnerabilities
    if (data.timeout) {
        clearTimeout(data.timeout);
    }

    if (message.method && methods[message.method]) {
        data.timeout = setTimeout(() => {
            // removePasswordHash();
        }, 1 * 20 * 1000);
        return methods[message.method](message);
    } else {
        // return Promise.reject('Method not not found.');
    }
});

function getPasswordHash() {
    return Promise.resolve(data.wallet.passwordHash);
}

function setPasswordHash(message) {
    if (message.hash) {
        data.wallet.passwordHash = message.hash;
    }
    return Promise.resolve(null);
}

function removePasswordHash() {
    data.wallet.passwordHash = undefined;
    return Promise.resolve(null);
}

function send(message) {
    return new Promise(async (resolve, reject) => {
        await browser.windows.create({
            url: `index.html?id=${message.id}&to=${message.to}&amount=${
                message.amount
            }#/confirmation`,
            type: 'popup',
            width: 350,
            height: 605
        });

        const responseCallback = m => {
            // console.log('send message listener', message);

            if (m.type === 'MOONLET_SEND_RESPONSE') {
                resolve(m);
                browser.runtime.onMessage.removeListener(responseCallback);
            }
            return Promise.resolve({});
        };

        browser.runtime.onMessage.addListener(responseCallback);
    });
}
