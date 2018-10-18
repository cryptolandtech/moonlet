import { Platform } from './../types';

export const getPlatform = () => {
    return process.env.PLATFORM;
};

export const isExtension = () => {
    return getPlatform() === 'EXTENSION';
};
