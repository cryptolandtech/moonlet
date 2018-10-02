import Wallet from 'moonlet-core/src/core/wallet';

let wallet;

export const decodeWallet = (json: string) => {
    wallet = Wallet.fromJson(json);
    return wallet;
};

export const createWallet = (
    mnemonics?: string,
    language?: string,
    mnemonicPassword?: string
): Wallet => {
    wallet = new Wallet(mnemonics, language, mnemonicPassword);
    return wallet;
};

export const getWallet = (): Wallet => {
    return wallet;
};
