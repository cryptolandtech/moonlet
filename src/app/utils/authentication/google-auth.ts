import { IAuth } from './auth-interface';

export class GoogleAuth implements IAuth {
    public async login(): Promise<any> {
        throw new Error('Not implemented');
    }

    public async logout(): Promise<any> {
        throw new Error('Not implemented');
    }

    public async getAuthToken(interactive: boolean = true): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                chrome.identity.getAuthToken({ interactive }, token => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(token);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    public async renewAuthToken(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const token = await this.getAuthToken(false);
                chrome.identity.removeCachedAuthToken({ token }, async () => {
                    if (chrome.runtime.lastError) {
                        reject();
                    } else {
                        resolve(this.getAuthToken());
                    }
                });
            } catch {
                resolve(this.getAuthToken());
            }
        });
    }

    public async isLoggedIn(): Promise<boolean> {
        return new Promise(resolve => {
            try {
                chrome.identity.getAuthToken({ interactive: false }, token => {
                    if (chrome.runtime.lastError) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            } catch (e) {
                resolve(false);
            }
        });
    }

    public getCurrentUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                chrome.identity.getProfileUserInfo(data => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(data);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}
