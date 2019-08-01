import { DappCommunicationController } from './../utils/communication/dapp-communication-controller';
import { browser } from 'webextension-polyfill-ts';
import { ConnectionPort } from '../../types';

const bgPort = browser.runtime.connect({ name: ConnectionPort.BACKGROUND } as any);

const injectScript = (file, nodeTagName) => {
    const node = document.getElementsByTagName(nodeTagName)[0];
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file);
    node.appendChild(script);
};

if (!(window as any).moonletContentScriptInjected) {
    (window as any).moonletContentScriptInjected = true;
    injectScript(browser.extension.getURL('/bundle.inject.dapp.js'), 'body');

    // start dapp communication controller
    new DappCommunicationController(bgPort).listen();
}
