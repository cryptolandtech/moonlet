import { IState } from '../data';

interface IFeatureDimensions {
    env?: string | string[];
    testnet?: boolean;
    installId?: string | string[];
}

export interface IFeaturesConfig {
    [name: string]: Array<{
        dimensions: IFeatureDimensions;
        active: boolean;
    }>;
}

class Feature {
    public currentDimensions = {};
    public featuresConfig: IFeaturesConfig;

    public setFeaturesConfig(config: IFeaturesConfig) {
        this.featuresConfig = config;
    }

    public updateCurrentDimensions(state: IState) {
        this.currentDimensions = {
            env: state.app.env,
            testnet: state.userPreferences.testNet,
            installId: state.app.installId
        };
    }

    public isActive(featureName): boolean {
        let isActive = false;

        if (this.featuresConfig) {
            const configs = this.featuresConfig[featureName];
            if (configs) {
                if (Array.isArray(configs) && configs.length > 0) {
                    for (const config of configs) {
                        if (this.dimensionsMatch(config.dimensions)) {
                            isActive = config.active;
                        }
                    }
                }
            }
        }
        return isActive;
    }

    private dimensionsMatch(dimensions: IFeatureDimensions): boolean {
        const keys = Object.keys(dimensions);
        for (const key of keys) {
            switch (key) {
                case 'installId':
                case 'env':
                    const list =
                        typeof dimensions[key] === 'string' ? [dimensions[key]] : dimensions[key];
                    if (list.indexOf(this.currentDimensions[key]) < 0) {
                        return false;
                    }
                    break;
                default:
                    if (this.currentDimensions[key] !== dimensions[key]) {
                        return false;
                    }
            }
        }

        return true;
    }
}

export const feature = new Feature();

export const FEATURE_CLOUD_BACKUP = 'cloudBackup';
export const FEATURE_HW_WALLET = 'hwWallet';
export const FEATURE_SEND_PAGE_NAME_RESOLUTION = 'sendPageNameResolution';
