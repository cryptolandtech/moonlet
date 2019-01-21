import { Deferred } from '../../../app/utils/deferred';
import { IResponseData } from '../../../app/utils/response';

const requests = new Map<string, Deferred>();

window.addEventListener('message', event => {
    // We only accept messages from ourselves
    if (event.source !== window) {
        return;
    }

    if (event.isTrusted && event.data && event.data.type === 'RESPONSE' && event.data.id) {
        const request = requests.get(event.data.id);
        if (request) {
            request.resolve(event.data.response);
            requests.delete(event.data.id);
        }
    }
});

const sendMessage = (action, params?: any[]): Promise<IResponseData> => {
    const messageId = `${Date.now()}${Math.random()
        .toString()
        .substr(2)}`;
    const deferred = new Deferred();
    postMessage(
        {
            type: 'REQUEST',
            id: messageId,
            action,
            params
        },
        '*'
    );
    requests.set(messageId, deferred);
    return deferred.promise;
};

export const ContentScriptCommunication = {
    sendMessage
};
