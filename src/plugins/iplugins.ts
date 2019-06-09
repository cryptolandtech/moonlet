import { ILedgerHwPlugin } from './ledger-hw/iledger-hw-plugin';
import { IWalletPlugin } from './wallet/iwallet-plugin';
import { IAppRemoteConfigPlugin } from './app-remote-config/iapp-remote-config-plugin';
import { IDappAccessPlugin } from './dapp-access/idapp-access';
import { IConfirmationScreenPlugin } from './confirmation-screen/iconfirmation-screen-plugin';

export interface IPlugins {
    wallet: IWalletPlugin;
    ledgerHw: ILedgerHwPlugin;
    remoteConfig: IAppRemoteConfigPlugin;
    dappAccess: IDappAccessPlugin;
    confirmationScreen: IConfirmationScreenPlugin;
}
