import { Blockchain } from 'moonlet-core/src/core/blockchain';

export enum WalletErrorCodes {
    GENERIC_ERROR = 'GENERIC_ERROR',
    INVALID_PASSWORD = 'INVALID_PASSWORD',
    WALLET_LOCKED = 'WALLET_LOCKED',
    WALLET_NOT_FOUND = 'WALLET_NOT_FOUND',
    ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND'
}

export interface IWalletProvider {
    createWallet(mnemonics, password);
    getWallet();
    getEncryptedWallet();
    loadEncryptedWallet(encryptedWallet, password);
    lockWallet();
    unlockWallet(password);
    saveWallet();
    switchNetwork(config: { [blockchain: string]: number });

    createAccount(blockchain, accountName?);
    importAccount(blockchain, privateKey, accountName?);
    importHWAccount(blockchain, accountName, accountIndex, derivationIndex);
    removeAccount(blockchain, address);
    isValidAddress(blockchain, address);
    getBalance(blockchain, address);
    getNonce(blockchain, address);
    transfer(blockchain, fromAddress, toAddress, amount, feeOptions);
}
