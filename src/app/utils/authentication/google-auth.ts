import { OAuth2, IAccessTokenOptions, IAccessToken } from './oAuth2';

const OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const CLIENT_ID = '277593866196-i66tdj21nhpp9j3uqkm1bd3l2n4gcf16.apps.googleusercontent.com';

export class GoogleAuth extends OAuth2 {
    constructor() {
        super(OAUTH_URL, CLIENT_ID);
    }

    protected getAuthUrl(scopes: string[], options: IAccessTokenOptions = {}): URL {
        const url = super.getAuthUrl(scopes, options);

        if (options.forceUserPrompt) {
            url.searchParams.append('prompt', 'select_account');
        }

        return url;
    }

    protected parseAccessToken(returnUri: string): IAccessToken {
        const url = new URL(returnUri);
        const params = new URLSearchParams(url.hash.replace(/^#/, ''));

        return {
            token: params.get('access_token'),
            expires: parseInt(params.get('expires_in'), 10),
            issueDate: Date.now(),
            scopes: params.get('scope').split(' ')
        };
    }
}

(window as any).GoogleAuth = GoogleAuth;
