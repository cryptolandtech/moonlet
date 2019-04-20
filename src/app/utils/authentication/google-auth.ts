import { IAuth } from './auth-interface';

export class GoogleAuth implements IAuth {
    public async login(): Promise<any> {
        throw new Error('Not implemented');
    }

    public async logout(): Promise<any> {
        throw new Error('Not implemented');
    }

    public async getAuthToken(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                chrome.identity.getAuthToken({ interactive: true }, token => {
                    resolve(token);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    public async renewAuthToken(): Promise<string> {
        return new Promise(async resolve => {
            const token = await this.getAuthToken();
            chrome.identity.removeCachedAuthToken({ token }, async () => {
                Promise.resolve(await this.getAuthToken());
            });
        });
    }

    public async isLoggedIn(): Promise<boolean> {
        return true;
    }

    public getCurrentUser(): Promise<any> {
        return new Promise(resolve => {
            chrome.identity.getProfileUserInfo(data => {
                resolve(data);
            });
        });
    }
}
