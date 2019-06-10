import { LedgerHwPlugin } from '../../ledger-hw/web';
import { extensionPluginToWeb } from '../../core/web/extension-plugin-to-web';
import { WalletController } from './wallet-controller';
import { WalletPlugin as WalletPluginExtension } from '../extension';
import { DappAccessController } from '../../dapp-access/extension/dapp-access-controller';
import { ConfirmationScreenController } from '../../confirmation-screen/extension/confirmation-screen-controller';

export class WalletPlugin extends extensionPluginToWeb(WalletPluginExtension) {
    constructor(ledgerPlugin: LedgerHwPlugin) {
        super(null);
        const dappAccessController = new DappAccessController();
        this.ctrl = new WalletController(
            ledgerPlugin.getController(),
            dappAccessController,
            new ConfirmationScreenController(dappAccessController)
        );
    }
}
