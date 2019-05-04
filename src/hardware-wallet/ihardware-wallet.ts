import { Blockchain } from 'moonlet-core/src/core/blockchain';

export interface IHardwareWallet {
    getAddress(accountIndex, derivationIndex);
    signTransaction(accountIndex, derivationIndex, transaction);
}
