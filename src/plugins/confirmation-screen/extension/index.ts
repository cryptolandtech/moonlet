import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { BgCommunicationPlugin } from './../../core/extension/bg-communication-plugin';
import { Runtime } from 'webextension-polyfill-ts';
import { BackgroundMessageController } from '../../../platforms/extension/types';
import { ConfirmationScreenType, IConfirmationScreenPlugin } from '../iconfirmation-screen-plugin';
import { IResponseData } from '../../../utils/response';

export class ConfirmationScreenPlugin extends BgCommunicationPlugin
    implements IConfirmationScreenPlugin {
    constructor(bgPort: Runtime.Port) {
        super(bgPort, BackgroundMessageController.CONFIRMATION_SCREEN);

        this.disableTimeout = true;
    }

    public openConfirmationScreen(screenType: ConfirmationScreenType, params: any) {
        return this.callAction('openConfirmationScreen', [screenType, params]);
    }

    public openAccountAccessScreen(blockchain: Blockchain, forceAccountSelection: boolean = false) {
        return this.openConfirmationScreen(ConfirmationScreenType.ACCOUNT_ACCESS, {
            blockchain,
            forceAccountSelection
        });
    }

    public getConfirmationScreenParams(id: string): Promise<IResponseData> {
        return this.callAction('getConfirmationScreenParams', [id], 5000);
    }

    public setConfirmationScreenResult(id: string, result: IResponseData) {
        return this.callAction('setConfirmationScreenResult', [id, result], 5000);
    }
}
