import { browser } from 'webextension-polyfill-ts';
import * as Sentry from '@sentry/browser';

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

export const getEnvironment = async (): Promise<'local' | 'staging' | 'production'> => {
    const extensionInfo = await browser.management.getSelf();

    if (extensionInfo.installType === 'development') {
        const manifest = await browser.runtime.getManifest();
        if (manifest.version === '0.0.0') {
            return 'local';
        } else {
            return 'staging';
        }
    }

    return 'production';
};

export const initErrorReporting = async () => {
    if (!isExtension()) {
        return;
    }

    const env = await getEnvironment();
    const manifest = await browser.runtime.getManifest();

    Sentry.init({
        dsn: 'https://49939a7bba26413b800c774a171b3e2b@sentry.io/1441540',
        environment: env,
        release: manifest.version,
        enabled: env !== 'local'
    });
};

// (window as any).Sentry = Sentry;
