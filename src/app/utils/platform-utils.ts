// TODO remove browser import
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
    let url = '/index.html';

    if (popup) {
        url += '?popup=1';
    }

    url += '#' + path;
    return url;
};

export const initErrorReporting = (appVersion: string, env: string) => {
    Sentry.init({
        dsn: 'https://49939a7bba26413b800c774a171b3e2b@sentry.io/1441540',
        environment: env,
        release: appVersion,
        enabled: env !== 'local'
    });
};

export const setExtraDataOnErrorReporting = installId => {
    Sentry.configureScope(scope => {
        scope.setTag('platform', getPlatform());
        scope.setTag('installId', installId);
    });
};
