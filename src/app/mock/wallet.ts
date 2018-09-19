interface IWallet {
    password: string;
}

export const getWallet = (): IWallet => {
    const serializedWallet = window.localStorage.getItem('wallet');
    let wallet;

    if (serializedWallet) {
        wallet = JSON.parse(serializedWallet);
    }

    return wallet;
};

export const setWallet = (wallet: IWallet) => {
    window.localStorage.setItem('wallet', JSON.stringify(wallet));
};
