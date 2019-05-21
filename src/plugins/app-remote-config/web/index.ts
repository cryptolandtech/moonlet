import { AppRemoteConfigController } from './../extension/app-remote-config-controller';
import { AppRemoteConfigPlugin as AppRemoteConfigPluginExtension } from './../extension/index';
import { extensionPluginToWeb } from '../../core/web/extension-plugin-to-web';

export class AppRemoteConfigPlugin extends extensionPluginToWeb(AppRemoteConfigPluginExtension) {
    constructor() {
        super(null);
        this.ctrl = new AppRemoteConfigController();
    }
}
