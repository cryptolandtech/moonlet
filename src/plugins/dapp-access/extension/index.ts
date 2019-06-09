import { BgCommunicationPlugin } from './../../core/extension/bg-communication-plugin';
import { IDappAccessPlugin } from '../idapp-access';
import { BackgroundMessageController } from '../../../platforms/extension/types';
import { Runtime } from 'webextension-polyfill-ts';
import { Blockchain } from 'moonlet-core/src/core/blockchain';

export class DappAccessPlugin extends BgCommunicationPlugin implements IDappAccessPlugin {
    constructor(port: Runtime.Port) {
        super(port, BackgroundMessageController.DAPP_ACCESS);
        // this.port = browser.runtime.connect({ name: ConnectionPort.BACKGROUND } as any);
    }

    public getAccount(dappUrl: string, blockchain: Blockchain, networkId: number) {
        return this.callAction('getAccount', [dappUrl, blockchain, networkId]);
    }

    public grantAccountAccess(
        dappUrl: string,
        blockchain: Blockchain,
        networkId: number,
        address: string
    ) {
        return this.callAction('grantAccess', [dappUrl, blockchain, networkId, address]);
    }

    public revokeAccountAccess(dappUrl: string, blockchain?: Blockchain, networkId?: number) {
        return this.callAction('revokeAccess', [dappUrl, blockchain, networkId]);
    }

    public grantDappPermission(dappUrl: string): Promise<boolean> {
        return this.callAction('grantDappPermission', [dappUrl], 30000);
    }
}
