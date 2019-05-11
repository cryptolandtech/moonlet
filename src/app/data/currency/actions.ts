import { AVAILABLE_CURRENCIES } from './../../utils/currency-conversion';
import { BLOCKCHAIN_INFO } from './../../../utils/blockchain/blockchain-info';
import { getTokenRates } from '../../utils/currency-conversion';

// Action constants
export const LOAD_CONVERSION_RATES = 'LOAD_CONVERSION_RATES';

// Action creators
export const createUpdateConversionRates = () => {
    return async dispatch => {
        try {
            const tokenList = [];
            for (const blockchain of Object.keys(BLOCKCHAIN_INFO)) {
                tokenList.push(BLOCKCHAIN_INFO[blockchain].coin.toUpperCase());
            }

            const rates = await getTokenRates(tokenList, AVAILABLE_CURRENCIES);
            dispatch({
                type: LOAD_CONVERSION_RATES,
                data: rates
            });
        } catch {
            // TODO: handle error
        }
    };
};
