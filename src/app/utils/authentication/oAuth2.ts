import { browser } from 'webextension-polyfill-ts';
import { IAuth } from './auth-interface';

export interface IAccessTokenOptions {
    forceUserPrompt?: boolean;
    interactive?: boolean;
}

export interface IAccessToken {
    token: string;
    expires: number;
    issueDate: number;
    scopes: string[];
}

export abstract class OAuth2 implements IAuth {
    protected authUrl: string;
    protected clientId: string;

    constructor(authUrl, clientId) {
        this.authUrl = authUrl;
        this.clientId = clientId;
    }

    public async getAccessToken(
        scopes: string[],
        options: IAccessTokenOptions = {}
    ): Promise<string> {
        const storageKey = this.getStorageKey();
        const storage = await browser.storage.local.get(storageKey);
        const tokenData: IAccessToken = storage[storageKey];

        if (
            tokenData &&
            tokenData.token &&
            tokenData.issueDate + tokenData.expires * 1000 > Date.now() + 60000
        ) {
            return tokenData.token;
        }

        return this.renewAccessToken(scopes, options);
    }

    public renewAccessToken(scopes: string[], options: IAccessTokenOptions = {}): Promise<string> {
        return browser.identity
            .launchWebAuthFlow({
                url: this.getAuthUrl(scopes, options).toString(),
                interactive: !!options.forceUserPrompt || !!options.interactive
            })
            .then(tokenData => this.parseAccessToken(tokenData))
            .then(tokenData => this.saveAccessToken(tokenData))
            .then(tokenData => tokenData.token);
    }

    public scope(scopes: string[]) {
        return {
            getAccessToken: options => this.getAccessToken(scopes, options),
            renewAccessToken: options => this.renewAccessToken(scopes, options),
            isLoggedIn: async () => !!(await this.getAccessToken(scopes, { interactive: false }))
        };
    }

    protected getStorageKey() {
        // TODO: this.constructor.name is not safe since class name is changed on minification
        return this.constructor.name + 'Token';
    }

    protected abstract parseAccessToken(returnUri: string): IAccessToken;

    protected getAuthUrl(scopes: string[], options: IAccessTokenOptions = {}): URL {
        const oauthUrl = new URL(this.authUrl);
        oauthUrl.searchParams.append('scope', scopes.join(' '));
        oauthUrl.searchParams.append('client_id', this.clientId);
        oauthUrl.searchParams.append('redirect_uri', browser.identity.getRedirectURL());
        oauthUrl.searchParams.append('response_type', 'token');

        return oauthUrl;
    }

    private async saveAccessToken(tokenData: IAccessToken): Promise<IAccessToken> {
        await browser.storage.local.set({
            [this.getStorageKey()]: tokenData
        });

        return tokenData;
    }
}
