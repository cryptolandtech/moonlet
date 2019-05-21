import { browser } from 'webextension-polyfill-ts';

export const getEnvironment = async (): Promise<'local' | 'staging' | 'production'> => {
    const extensionInfo = await browser.management.getSelf();

    if (extensionInfo.installType === 'development') {
        const manifest = browser.runtime.getManifest();
        if (manifest.version === '0.0.0') {
            return 'local';
        } else {
            return 'staging';
        }
    }

    return 'production';
};
