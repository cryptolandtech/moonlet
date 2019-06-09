import { WALLET_ID } from './utils/constants';
import { browser } from 'webextension-polyfill-ts';
import { wallet } from 'dapp-wallet-util';
import { ConnectionPort } from '../types';
import { DappAccessPlugin } from '../../../plugins/dapp-access/extension';

const bgPort = browser.runtime.connect({ name: ConnectionPort.BACKGROUND } as any);

const dappAccessPlugin = new DappAccessPlugin(bgPort);

wallet.onGrantPermissionRequest(WALLET_ID, async (data, ev: MessageEvent) => {
    const granted = await dappAccessPlugin.grantDappPermission(ev.origin);
    wallet.sendGrantPermissionResponse(WALLET_ID, granted, ev.origin);
});

wallet.sendWalletReadyEvent(WALLET_ID);
