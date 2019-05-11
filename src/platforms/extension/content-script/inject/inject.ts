import { ContentScriptCommunication } from './content-script-communication';
import { Response } from '../../../../utils/response';
import { Account } from './account';

let account;

(window as any).moonlet = {
    getAccount: async (blockchain): Promise<Account> => {
        if (account) {
            return Promise.resolve(account);
        }

        try {
            const response = await ContentScriptCommunication.sendMessage('getAccount', [
                blockchain
            ]);
            if (response.error) {
                return Promise.reject(response);
            }

            if (response.data.blockchain && response.data.address) {
                account = new Account(response.data.blockchain, response.data.address);
                return Promise.resolve(account);
            }

            return Promise.reject(
                Response.reject('GENERIC_ERROR', 'Response from Moonlet extension is invalid.')
            );
        } catch (e) {
            return Promise.reject(
                Response.reject(e.code || 'GENERIC_ERROR', e.message, e.data || e)
            );
        }
    }
};
