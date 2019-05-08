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
    public currentDimensions;
    public featuresConfig: IFeaturesConfig;

    public setFeaturesConfig(config: IFeaturesConfig) {
        this.featuresConfig = config;
    }

    public setCurrentDimensions(dimensions: IFeatureDimensions, replace?: boolean) {
        if (replace) {
            this.currentDimensions = { ...dimensions };
        } else {
            Object.assign(this.currentDimensions, dimensions);
        }
    }

    public isActive(featureName): boolean {
        if (this.featuresConfig) {
            const configs = this.featuresConfig[featureName];
            if (Array.isArray(configs) && configs.length > 0) {
                for (const config of configs) {
                    return this.dimensionsMatch(config.dimensions) && config.active;
                }
            }
        }
        return false;
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

feature.setFeaturesConfig({
    cloudBackup: [
        {
            dimensions: {
                env: ['local', 'staging']
            },
            active: true
        }
    ]
});
