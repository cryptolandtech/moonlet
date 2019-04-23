import { browser } from 'webextension-polyfill-ts';
import { Platform } from './../types';

export const getPlatform = () => {
    return process.env.PLATFORM;
};

export const isExtension = () => {
    return getPlatform() === 'EXTENSION';
};

export const isExtensionPopup = () => {
    return isExtension() && document.location.search.indexOf('popup=1') > 0;
};

export const getExtensionUrl = (path: string, popup: boolean): string => {
    const url = new URL(browser.extension.getURL('index.html'));
    url.hash = '#' + path;

    if (popup) {
        url.searchParams.append('popup', '1');
    }

    return url.toString();
};
