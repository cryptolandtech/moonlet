import { extensionPluginToWeb } from '../../core/web/extension-plugin-to-web';
import { WalletController } from './wallet-controller';
import { WalletPlugin as WalletPluginExtension } from '../extension';

export class WalletPlugin extends extensionPluginToWeb(WalletPluginExtension) {
    constructor() {
        super(null);
        this.ctrl = new WalletController();
    }
}
