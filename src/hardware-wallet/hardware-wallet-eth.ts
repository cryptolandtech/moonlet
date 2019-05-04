import 'babel-polyfill';
// https://github.com/LedgerHQ/ledgerjs/issues/266

import { IHardwareWallet } from './ihardware-wallet';

import TransportU2F from '@ledgerhq/hw-transport-u2f';
import Eth from '@ledgerhq/hw-app-eth';

export class HardwareWalletEthereum implements IHardwareWallet {
    public async getAddress(accountIndex, derivationIndex) {
        try {
            const transport = await TransportU2F.create();
            const eth = new Eth(transport);

            const path = "44'/60'/" + accountIndex + "'/0/" + derivationIndex;

            const { address } = await eth.getAddress(path);

            return address;
        } catch (error) {
            throw Error(error);
        }
    }

    public async getAddressesInRange(
        accountIndexStart,
        accountIndexEnd,
        derivationIndexStart,
        derivationIndexEnd
    ) {
        try {
            const transport = await TransportU2F.create();
            const eth = new Eth(transport);

            for (let ai = accountIndexStart; ai <= accountIndexEnd; ai++) {
                for (let di = derivationIndexStart; di <= derivationIndexEnd; di++) {
                    const path = "44'/60'/" + ai + "'/0/" + di;
                    const { address } = await eth.getAddress(path);
                }
            }
        } catch (error) {
            throw Error(error);
        }
    }

    public signTransaction(accountIndex, derivationIndex, transaction) {
        throw new Error('Method not implemented.');
    }
}
