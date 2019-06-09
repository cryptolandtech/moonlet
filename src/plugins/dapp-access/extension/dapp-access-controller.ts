import { browser } from 'webextension-polyfill-ts';
import { WalletController } from '../../wallet/extension/wallet-controller';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { Response, IResponseData } from '../../../utils/response';
import { deserialize, serialize } from '../../../utils/object-utils';
import { DappAccessErrorCodes } from '../idapp-access';

interface IAccountAccess {
    accounts: Map<Blockchain, { [networkId: number]: string }>;
}

const STORAGE_KEY = 'dappAccessConfig';

export class DappAccessController {
    private accessMap: Map<string, IAccountAccess> = new Map();

    constructor(walletController: WalletController) {
        // get data from storage
        this.loadDataFromStorage();
    }

    public async grantDappPermission(sender, dappUrl: string) {
        let granted;
        try {
            const url = new URL(dappUrl);
            const dappDomain = url.host;
            granted = await browser.permissions.request({
                origins: [`https://${dappDomain}/*`]
            });

            if (granted) {
                browser.tabs.query({}).then(tabs => {
                    tabs.forEach(tab => {
                        const tabDomain =
                            tab.url && tab.url.indexOf('chrome://') !== 0
                                ? new URL(tab.url).host
                                : null;
                        if (tab.id && tabDomain && tabDomain === dappDomain) {
                            // console.log('injecting content script to ', tab.url);
                            chrome.tabs.executeScript(tab.id, {
                                file: 'bundle.cs.dapp.js'
                            });
                        }
                    });
                });
            }
        } catch {
            granted = false;
        }

        return Response.resolve(granted);
    }

    public async getAccount(
        sender,
        dappUrl: string,
        blockchain: Blockchain,
        networkId?: number
    ): Promise<IResponseData> {
        const dappKey = this.getDappKey(dappUrl);
        if (dappKey) {
            const dappAccess = this.accessMap.get(dappKey);
            if (dappAccess && dappAccess.accounts) {
                const blockchainAccess = dappAccess.accounts.get(blockchain);
                if (blockchainAccess && blockchainAccess[networkId]) {
                    return Response.resolve(blockchainAccess[networkId]);
                }
            }

            return Response.reject(
                DappAccessErrorCodes.UNAUTHORIZED_ACCESS,
                `${dappUrl} doesn't have access to any accounts.`
            );
        }

        // invalid request, dappUrl must be a valid url
        return Response.reject(
            DappAccessErrorCodes.INVALID_DAPP_URL,
            'dappUrl must be a valid url'
        );
    }

    public async grantAccountAccess(
        sender,
        dappUrl: string,
        blockchain: Blockchain,
        networkId: number,
        address: string
    ) {
        const dappKey = this.getDappKey(dappUrl);
        if (dappKey) {
            if (!this.accessMap.has(dappKey)) {
                this.accessMap.set(dappKey, {
                    accounts: new Map()
                });
            }
            const dappAccess = this.accessMap.get(dappKey);

            if (!dappAccess.accounts.has(blockchain)) {
                dappAccess.accounts.set(blockchain, {});
            }
            const blockchainAccess = dappAccess.accounts.get(blockchain);
            blockchainAccess[networkId] = address;

            this.saveDataToStorage();
            return Response.resolve();
        }

        // invalid request, dappUrl must be a valid url
        return Response.reject(
            DappAccessErrorCodes.INVALID_DAPP_URL,
            'dappUrl must be a valid url'
        );
    }

    public async revokeAccountAccess(
        sender,
        dappUrl: string,
        blockchain?: Blockchain,
        networkId?: number
    ) {
        const dappKey = this.getDappKey(dappUrl);
        if (dappKey) {
            const dappAccess = this.accessMap.get(dappKey);

            // check if there is something to remove
            if (dappAccess && dappAccess.accounts) {
                if (typeof blockchain === 'undefined' && typeof networkId === 'undefined') {
                    // remove all dapp access
                    this.accessMap.delete(dappKey);
                } else if (typeof blockchain === 'undefined') {
                    // remove blockchain for selected dapp
                    dappAccess.accounts.delete(blockchain);
                } else {
                    // remove only the address for blockchain and networkId
                    const blockchainAccess = dappAccess.accounts.get(blockchain);
                    if (blockchainAccess) {
                        delete blockchainAccess[networkId];
                    }
                }

                this.saveDataToStorage();
            }

            return Response.resolve();
        }

        // invalid request, dappUrl must be a valid url
        return Response.reject(
            DappAccessErrorCodes.INVALID_DAPP_URL,
            'dappUrl must be a valid url'
        );
    }

    private async loadDataFromStorage() {
        try {
            const configStr = await browser.storage.local.get(STORAGE_KEY);
            this.accessMap =
                configStr && configStr[STORAGE_KEY]
                    ? deserialize(configStr[STORAGE_KEY])
                    : (this.accessMap = new Map());
        } catch {
            this.accessMap = new Map();
        }
    }

    private async saveDataToStorage() {
        const configStr = serialize(this.accessMap);
        browser.storage.local.set({
            [STORAGE_KEY]: configStr
        });
    }

    private getDappKey(dappUrl) {
        try {
            const url = new URL(dappUrl);
            return url.hostname;
        } catch {
            return undefined;
        }
    }
}
