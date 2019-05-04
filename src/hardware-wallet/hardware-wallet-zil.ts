import 'babel-polyfill';
// https://github.com/LedgerHQ/ledgerjs/issues/266

import { IHardwareWallet } from './ihardware-wallet';

import TransportU2F from '@ledgerhq/hw-transport-u2f';
import Zilliqa from 'zil-ledger-js-interface';

export class HardwareWalletZilliqa implements IHardwareWallet {
    public async getAddress() {
        const transport = await TransportU2F.create();
        const zil = new Zilliqa(transport);

        // const { address } = await zil.getAddress("44'/60'/0'/0'/0");
    }

    public signTransaction() {
        throw new Error('Method not implemented.');
    }
}
