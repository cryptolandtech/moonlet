import { Response } from '../../../utils/response';
import { BaseWalletController } from '../base-wallet-controller';

export class WalletController extends BaseWalletController {
    public sendMessage(message) {
        return Response.reject('NOT_IMPLEMENTED');
    }

    public async saveWallet() {
        return Response.reject('NOT_IMPLEMENTED');
    }

    protected async loadFromStorage() {
        return Response.reject('NOT_IMPLEMENTED');
    }
}
