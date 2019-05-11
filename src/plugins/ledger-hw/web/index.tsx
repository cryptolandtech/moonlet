import { bgControllerToPlugin } from '../../core/web/bg-controller-to-plugin';
import { LedgerHwController } from '../extension/ledger-hw-controller';

const controller = new LedgerHwController();

export const LedgerHwPlugin = bgControllerToPlugin(controller);
