import {
    BackgroundMessageController,
    IBackgroundMessage,
    BackgroundMessageType,
    ConnectionPort
} from './../types';
import { browser, Runtime, Tabs } from 'webextension-polyfill-ts';
import { WalletManager } from './wallet-manager';
import { Response, IResponseData } from '../../app/utils/response';
import { RemoteInterface } from './remote-interface';

// Implementation
const walletManager = new WalletManager();
const remoteInterface = new RemoteInterface(walletManager);

const controllers = {
    [BackgroundMessageController.WALLET_MANAGER]: walletManager,
    [BackgroundMessageController.REMOTE_INTERFACE]: remoteInterface
};

const generateResponse = (message: IBackgroundMessage, response: IResponseData) => {
    return { ...message, type: BackgroundMessageType.RESPONSE, response };
};

browser.runtime.onConnect.addListener((port: Runtime.Port) => {
    if (port.name === ConnectionPort.POPUP_DETECTION) {
        // popup open

        port.onDisconnect.addListener(() => {
            // popup closed
        });
    }
    if (port.name === ConnectionPort.BACKGROUND) {
        // console.log('bg port connected');
        port.onMessage.addListener(async (message: IBackgroundMessage) => {
            // console.log('bg port', 'message', message);
            // TODO: extra check the message (sender.id)
            if (
                message.id &&
                message.type === BackgroundMessageType.REQUEST &&
                message.request &&
                controllers[message.request.controller] &&
                typeof controllers[message.request.controller][message.request.action] ===
                    'function'
            ) {
                try {
                    const response = await controllers[message.request.controller][
                        message.request.action
                    ](port.sender, ...(message.request.params || []));
                    port.postMessage(generateResponse(message, response));
                    // console.log('bg port', 'response', response);
                } catch (error) {
                    port.postMessage(
                        generateResponse(message, Response.reject('GENERIC_ERROR', error))
                    );
                }
            } else {
                port.postMessage(generateResponse(message, Response.reject('INVALID_REQUEST')));
            }
        });
    }
});

// browser.tabs.onActivated.addListener(async (activeTab: Tabs.OnActivatedActiveInfoType) => {
//     const tab = await browser.tabs.get(activeTab.tabId);
//     if (tab.url && tab.url.startsWith('chrome-extension://' + browser.runtime.id)) {
//         extensionStatus.tabOpen = true;
//         toggleSecureBadge();
//     } else {
//         extensionStatus.tabOpen = false;
//         toggleSecureBadge();
//     }
// });

// browser.windows.onFocusChanged.addListener(async (windowId: number) => {
//     const window = await browser.windows.get(windowId, {populate: true});
//     if (window.tabs) {
//         const tab = window.tabs.filter(tab => tab.active)[0];
//         if (tab && tab.url && tab.url.startsWith('chrome-extension://' + browser.runtime.id)) {
//             extensionStatus.tabOpen = true;
//             await toggleSecureBadge();
//         } else {
//             extensionStatus.tabOpen = false;
//             await toggleSecureBadge();
//         }
//     }
// });
