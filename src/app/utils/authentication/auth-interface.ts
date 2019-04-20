export interface IAuth {
    isLoggedIn(): Promise<boolean>;
    login(): Promise<any>;
    logout(): Promise<any>;
    getAuthToken(): Promise<string>;
    getCurrentUser(): Promise<any>;
}
