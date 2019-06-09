import { Deferred } from './../../../utils/deferred';
import { IResponseData, Response } from './../../../utils/response';
import {
    ConfirmationScreenType,
    ConfirmationScreenErrorCodes
} from '../iconfirmation-screen-plugin';

import * as uuid from 'uuid/v4';
import { browser, Runtime } from 'webextension-polyfill-ts';
import { DappAccessController } from '../../dapp-access/extension/dapp-access-controller';

interface IScreen {
    type: ConfirmationScreenType;
    sender: Runtime.MessageSender;
    params: any;
    windowId: number;
    openTimestamp: number;
    deferred: Deferred;
}

const screenTypeUrlProviderMap = {
    [ConfirmationScreenType.ACCOUNT_ACCESS]: id =>
        `/index.html?confirmationScreen=1&id=${id}#/confirmation-screen`
};

export class ConfirmationScreenController {
    private dappAccessController: DappAccessController;
    private screenMap: Map<string, IScreen> = new Map();

    constructor(dappAccessController: DappAccessController) {
        this.dappAccessController = dappAccessController;
    }

    public async openConfirmationScreen(sender, screenType: ConfirmationScreenType, params: any) {
        const id = uuid();
        const screenUrlProvider = screenTypeUrlProviderMap[screenType];

        if (typeof screenUrlProvider === 'function') {
            // open window;
            const window = await browser.windows.create({
                url: screenUrlProvider(id),
                type: 'popup',
                width: 350,
                height: 605
            });
            // console.log(id, 'window created', window.id);

            // handle window close
            const onWindowClose = windowId => {
                // console.log('window closed', windowId);
                if (windowId === window.id) {
                    // console.log(id, 'window closed');
                    browser.windows.onRemoved.removeListener(onWindowClose);
                    this.setConfirmationScreenResult(
                        sender,
                        id,
                        Response.reject(
                            ConfirmationScreenErrorCodes.ACCESS_REJECTED_BY_USER,
                            `User closed confirmation window.`
                        )
                    );
                }
            };
            browser.windows.onRemoved.addListener(onWindowClose);

            // save screen
            const screen: IScreen = {
                type: screenType,
                params,
                sender,
                windowId: window.id,
                openTimestamp: Date.now(),
                deferred: new Deferred()
            };
            this.screenMap.set(id, screen);

            return screen.deferred.promise;
        }
    }

    public async getConfirmationScreenParams(sender, id: string): Promise<IResponseData> {
        const screen = this.screenMap.get(id);

        if (screen) {
            return Response.resolve({
                type: screen.type,
                params: screen.params,
                sender: screen.sender
            });
        }

        return Response.reject(
            ConfirmationScreenErrorCodes.INVALID_ID,
            `Screen with id:${id} was not found.`
        );
    }

    public async setConfirmationScreenResult(sender, id: string, result: IResponseData) {
        const screen = this.screenMap.get(id);

        if (screen) {
            // console.log(id, 'send result', result);
            screen.deferred.resolve(result);
            this.screenMap.delete(id);

            switch (screen.type) {
                case ConfirmationScreenType.ACCOUNT_ACCESS:
                    try {
                        if (!result.error) {
                            await this.dappAccessController.grantAccountAccess(
                                sender,
                                screen.sender.tab.url,
                                screen.params.blockchain,
                                result.data.networkId,
                                result.data.address
                            );
                        }
                    } catch (e) {
                        return Response.reject(e.code || 'GENERIC_ERROR', e.message, e.data);
                    }
                    break;
            }
            return Response.resolve();
        }

        return Response.reject(
            ConfirmationScreenErrorCodes.INVALID_ID,
            `Screen with id:${id} was not found.`
        );
    }
}
