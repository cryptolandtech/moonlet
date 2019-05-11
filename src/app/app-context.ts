import { IPlugins } from './../plugins/iplugins';
import { IWalletPlugin } from '../plugins/wallet/iwallet-plugin';

const context = {};

export const appContext = (key, value?) => {
    if (key) {
        if (value) {
            context[key] = value;
            return true;
        } else {
            return context[key];
        }
    }

    return undefined;
};

export const getPlugins = (): IPlugins => {
    return appContext('plugins');
};

export const getWalletPlugin = (): IWalletPlugin => {
    return getPlugins().wallet;
};
