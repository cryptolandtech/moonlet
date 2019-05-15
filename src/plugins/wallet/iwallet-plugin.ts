export enum WalletErrorCodes {
    GENERIC_ERROR = 'GENERIC_ERROR',
    INVALID_PASSWORD = 'INVALID_PASSWORD',
    WALLET_LOCKED = 'WALLET_LOCKED',
    WALLET_NOT_FOUND = 'WALLET_NOT_FOUND',
    ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND'
}

export interface IWalletPlugin {
    createWallet(mnemonics, password);
    getWallet();
    getEncryptedWallet();
    loadEncryptedWallet(encryptedWallet, password);
    lockWallet();
    unlockWallet(password);
    saveWallet();
    switchNetwork(config: { [blockchain: string]: number });

    generateMnemonics(): Promise<string>;
    validateMnemonics(mnemonic): Promise<boolean>;

    createAccount(blockchain, accountName?);
    importAccount(blockchain, privateKey, accountName?);
    importHWAccount(
        deviceType,
        blockchain,
        accountName,
        derivationPath,
        address,
        accountIndex,
        derivationIndex
    );
    removeAccount(blockchain, address);
    isValidAddress(blockchain, address);
    getBalance(blockchain, address);
    getNonce(blockchain, address);
    transfer(blockchain, fromAddress, toAddress, amount, feeOptions);
}
