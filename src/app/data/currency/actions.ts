import { IPlugins } from '../../../plugins/iplugins';

// Action constants
export const LOAD_CONVERSION_RATES = 'LOAD_CONVERSION_RATES';

// Action creators
export const createUpdateConversionRates = (plugins: IPlugins) => {
    return async dispatch => {
        try {
            const rates = await plugins.remoteConfig.getExchangeRates();
            dispatch({
                type: LOAD_CONVERSION_RATES,
                data: rates
            });
        } catch {
            // TODO: handle error
        }
    };
};
