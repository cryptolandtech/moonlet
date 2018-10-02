import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { Network } from 'moonlet-core/src/core/network';
// Action constants

export const CHANGE_NETWORK = 'CHANGE_NETWORK';

// Action creators

export const createChangeNetwork = (blockchain: Blockchain, network: Network) => {
    return {
        type: CHANGE_NETWORK,
        data: {
            blockchain,
            network
        }
    };
};
