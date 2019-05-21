import { BgCommunicationPlugin } from './../../core/extension/bg-communication-plugin';
import { BackgroundMessageController } from '../../../platforms/extension/types';
import { Runtime } from 'webextension-polyfill-ts';
import { IAppRemoteConfigPlugin } from '../iapp-remote-config-plugin';

export class AppRemoteConfigPlugin extends BgCommunicationPlugin implements IAppRemoteConfigPlugin {
    constructor(port: Runtime.Port) {
        super(port, BackgroundMessageController.REMOTE_CONFIG);
    }

    public getExchangeRates() {
        return this.callAction('getExchangeRates');
    }

    public getFeaturesConfig() {
        return this.callAction('getFeaturesConfig');
    }
}
