export const AVAILABLE_CURRENCIES = ['USD', 'EUR', 'JPY', 'SGD', 'CNY'];

export const getTokenRates = async (from: string[], to: string[]) => {
    // const endpoint = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${from
    //     .map(t => t.toUpperCase())
    //     .join(',')}&tsyms=${to.map(t => t.toUpperCase()).join(',')}`;

    const endpoint = 'https://moonlet-wallet.firebaseapp.com/api/exchangeRates';
    const response = await fetch(endpoint);

    return response.json();
};
