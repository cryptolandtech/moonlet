export interface IAuth {
    getAccessToken(scopes: string[], options?: any): Promise<string>;
    renewAccessToken(scopes: string[], options?: any): Promise<string>;

    // isLoggedIn(): Promise<boolean>;
    // logout(): Promise<any>;
    // getCurrentUser(): Promise<any>;
    // login();
}
