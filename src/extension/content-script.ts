import { browser } from 'webextension-polyfill-ts';

const injectScript = (file, node) => {
    const th = document.getElementsByTagName(node)[0];
    const s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
};

injectScript(chrome.extension.getURL('/bundle.moonlet-web.js'), 'body');

window.addEventListener(
    'message',
    async event => {
        // We only accept messages from ourselves
        if (event.source !== window) {
            return;
        }

        if (event.data && event.data.type === 'MOONLET_SEND') {
            // console.log('Content script received: ', event.data, event.source);
            let response;
            try {
                response = await browser.runtime.sendMessage({ method: 'send', ...event.data });
            } catch (e) {
                response = e;
            }
            // console.log('Content script response from send: ', response);
            window.postMessage(response, '*');
        }
    },
    false
);
