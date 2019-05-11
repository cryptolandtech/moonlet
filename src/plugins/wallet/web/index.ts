import { WalletController } from './wallet-controller';
import { bgControllerToPlugin } from '../../core/web/bg-controller-to-plugin';

const controller = new WalletController();

export const WalletPlugin = bgControllerToPlugin(controller);
