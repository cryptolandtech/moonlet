import { ILedgerHwPlugin } from './ledger-hw/iledger-hw-plugin';
import { IWalletPlugin } from './wallet/iwallet-plugin';

export interface IPlugins {
    wallet: IWalletPlugin;
    ledgerHw: ILedgerHwPlugin;
}
