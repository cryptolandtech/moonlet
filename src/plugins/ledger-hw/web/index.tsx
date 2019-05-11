import { LedgerHwController } from '../extension/ledger-hw-controller';
import { LedgerHwPlugin as LedgerHwPluginExtension } from '../extension';
import { extensionPluginToWeb } from '../../core/web/extension-plugin-to-web';

export class LedgerHwPlugin extends extensionPluginToWeb(LedgerHwPluginExtension) {
    constructor() {
        super(null);
        this.ctrl = new LedgerHwController();
    }
}
