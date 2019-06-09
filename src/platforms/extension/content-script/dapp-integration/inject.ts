import { Communication } from './../utils/communication/communication';
import { WALLET_ID } from '../utils/constants';
import { ZilliqaProvider } from './providers/zilliqa';
import { wallet } from 'dapp-wallet-util';

const comm = new Communication();

class MoonletWallet {
    public providers: any = {};
    private comm: Communication;

    constructor(c: Communication) {
        this.comm = c;

        this.providers.zilliqa = new ZilliqaProvider(this.comm);

        this.sendReadyEvent();
    }

    private sendReadyEvent() {
        wallet.sendScriptInjectedEvent(WALLET_ID);
    }
}

(window as any).moonlet = new MoonletWallet(comm);
