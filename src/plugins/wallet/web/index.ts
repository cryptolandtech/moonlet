import { LedgerHwPlugin } from '../../ledger-hw/web';
import { extensionPluginToWeb } from '../../core/web/extension-plugin-to-web';
import { WalletController } from './wallet-controller';
import { WalletPlugin as WalletPluginExtension } from '../extension';

export class WalletPlugin extends extensionPluginToWeb(WalletPluginExtension) {
    constructor(ledgerPlugin: LedgerHwPlugin) {
        super(null);
        this.ctrl = new WalletController(ledgerPlugin.getController());
    }
}
