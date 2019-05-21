// Action constants
export const UPDATE_APP = 'UPDATE_APP';

// Action creators
export const createUpdateApp = (env: string, installId: string) => {
    return {
        type: UPDATE_APP,
        data: {
            env,
            installId
        }
    };
};
