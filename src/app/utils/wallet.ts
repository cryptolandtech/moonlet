import Wallet from 'moonlet-core/src/core/wallet';
import { Blockchain } from 'moonlet-core/src/core/blockchain';

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
    wallet.createAccount(Blockchain.ETHEREUM);
    wallet.createAccount(Blockchain.ZILLIQA);
    return wallet;
};

export const getWallet = (): Wallet => {
    return wallet;
};

export const clearWallet = () => {
    wallet = undefined;
};
