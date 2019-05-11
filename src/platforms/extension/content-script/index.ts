import { browser } from 'webextension-polyfill-ts';
import { Response } from '../../../utils/response';

const injectScript = (file, nodeTagName) => {
    const node = document.getElementsByTagName(nodeTagName)[0];
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file);
    node.appendChild(script);
};

injectScript(browser.extension.getURL('/bundle.web-inject.js'), 'body');

const allowedActions = ['getAccount', 'getBalance', 'getNonce', 'transfer'];
window.addEventListener('message', async event => {
    // We only accept messages from ourselves
    if (event.source !== window) {
        return;
    }

    if (event.isTrusted && event.data && event.data.type === 'REQUEST' && event.data.id) {
        if (allowedActions.indexOf(event.data.action) >= 0) {
            const response = await browser.runtime.sendMessage({
                scope: 'remoteInterface',
                action: event.data.action,
                params: event.data.params
            });

            postMessage(
                {
                    type: 'RESPONSE',
                    id: event.data.id,
                    response
                },
                '*'
            );
        } else {
            postMessage(
                {
                    type: 'RESPONSE',
                    id: event.data.id,
                    response: Response.reject('ACTION_NOT_ALLOWED')
                },
                '*'
            );
        }
    }
});
