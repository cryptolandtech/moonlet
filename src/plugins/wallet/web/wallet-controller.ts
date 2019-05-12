import { Response } from '../../../utils/response';
import { BaseWalletController } from '../base-wallet-controller';

export class WalletController extends BaseWalletController {
    public sendMessage(message) {
        return Response.resolve();
    }

    public async saveWallet() {
        return Response.resolve();
    }

    protected async loadFromStorage() {
        return Response.resolve();
    }
}
