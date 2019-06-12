import { ConfirmationScreenController } from './../../../plugins/confirmation-screen/extension/confirmation-screen-controller';
import { DappAccessController } from './../../../plugins/dapp-access/extension/dapp-access-controller';
import { AppRemoteConfigController } from './../../../plugins/app-remote-config/extension/app-remote-config-controller';
import { LedgerHwController } from './../../../plugins/ledger-hw/extension/ledger-hw-controller';
import { WalletController } from './../../../plugins/wallet/extension/wallet-controller';
import {
    BackgroundMessageController,
    IBackgroundMessage,
    BackgroundMessageType,
    ConnectionPort
} from '../types';
import { browser, Runtime, Tabs } from 'webextension-polyfill-ts';

import { Response, IResponseData } from '../../../utils/response';

import { BrowserIconManager } from './browser-icon-manager';
import {
    initErrorReporting,
    setExtraDataOnErrorReporting
} from '../../../app/utils/platform-utils';
import { getEnvironment } from '../utils';
import * as uuid from 'uuid/v4';

const INSTALL_ID_KEY = 'installId';

// initialize Sentry
(async () => {
    const storage = await browser.storage.local.get();
    const env = await getEnvironment();
    let installId = storage[INSTALL_ID_KEY];
    if (!installId) {
        installId = uuid();
        browser.storage.local.set({
            [INSTALL_ID_KEY]: installId
        });
    }
    initErrorReporting(await browser.runtime.getManifest().version, env);
    setExtraDataOnErrorReporting(installId);
})();

// Implementation
// initialize controllers
const browserIconManager = new BrowserIconManager();
const ledgerController = new LedgerHwController();
const dappAccessController = new DappAccessController();
const confirmationScreenController = new ConfirmationScreenController(dappAccessController);
const walletController = new WalletController(
    ledgerController,
    dappAccessController,
    confirmationScreenController
);
const controllers = {
    [BackgroundMessageController.WALLET_CONTROLLER]: walletController,
    [BackgroundMessageController.LEDGER_HW_CONTROLLER]: ledgerController,
    [BackgroundMessageController.REMOTE_CONFIG]: new AppRemoteConfigController(),
    [BackgroundMessageController.DAPP_ACCESS]: dappAccessController,
    [BackgroundMessageController.CONFIRMATION_SCREEN]: confirmationScreenController
};

const generateResponse = (message: IBackgroundMessage, response: IResponseData) => {
    return { ...message, type: BackgroundMessageType.RESPONSE, response };
};

// setup message listeners
browser.runtime.onConnect.addListener((port: Runtime.Port) => {
    if (port.name === ConnectionPort.BACKGROUND) {
        const connectionId = uuid();
        browserIconManager.openConnection(connectionId);

        let portDisconnected = false;
        port.onDisconnect.addListener(() => {
            portDisconnected = true;
            browserIconManager.closeConnection(connectionId);
        });
        // console.log('bg port connected');
        port.onMessage.addListener(async (message: IBackgroundMessage) => {
            // console.log('bg port', {message, sender: port.sender});
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
                    if (!portDisconnected) {
                        port.postMessage(generateResponse(message, response));
                        // console.log('bg port', 'response', response);
                    }
                } catch (error) {
                    if (!portDisconnected) {
                        port.postMessage(
                            generateResponse(message, Response.reject('GENERIC_ERROR', error))
                        );
                    }
                }
            } else {
                port.postMessage(generateResponse(message, Response.reject('INVALID_REQUEST')));
            }
        });
    }
});

// set dev badge for non production environments
getEnvironment().then(env => {
    if (env === 'local') {
        browser.browserAction.setBadgeBackgroundColor({ color: 'orange' });
        browser.browserAction.setBadgeText({ text: 'L' });
    } else if (env === 'staging') {
        browser.browserAction.setBadgeBackgroundColor({ color: 'orange' });
        browser.browserAction.setBadgeText({ text: 'DEV' });
    }
});

// thankyou pages hooks
browser.runtime.onInstalled.addListener(async (details: Runtime.OnInstalledDetailsType) => {
    if (details.reason === 'install') {
        browser.tabs.create({
            url: 'https://moonlet.xyz/thank-you/'
        });
    }

    const version = browser.runtime.getManifest().version;
    if (
        details.reason === 'update' &&
        details.previousVersion !== version &&
        ['0.17.0'].indexOf(version) >= 0
    ) {
        browser.tabs.create({
            url: 'https://moonlet.xyz/thank-you-update/'
        });
    }
});
browser.runtime.setUninstallURL('https://moonlet.xyz/thank-you-delete/');

// content script injection
// disable content script injection on production
getEnvironment().then(env => {
    if (env !== 'production') {
        browser.tabs.onUpdated.addListener(
            (tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) => {
                if (tab.url && changeInfo.status === 'loading') {
                    chrome.tabs.executeScript(tabId, {
                        file: 'bundle.cs.dapp.js'
                    });
                }
            }
        );
    }
});
