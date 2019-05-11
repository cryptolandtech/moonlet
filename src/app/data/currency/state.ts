export interface ICurrency {
    [token: string]: {
        [currency: string]: number;
        lastUpdate: number;
    };
}
