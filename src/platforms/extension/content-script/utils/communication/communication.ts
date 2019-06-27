import { IResponseData } from './../../../../../utils/response';
import { Deferred } from '../../../../../utils/deferred';
import * as uuid from 'uuid/v4';

export class Communication {
    private requests = new Map<string, Deferred>();

    constructor() {
        window.addEventListener('message', this.onMessage.bind(this));
    }

    public request(controller, method, params): Promise<IResponseData> {
        // console.log('Communication', 'request', {controller, method, params});
        const messageId = uuid();
        const deferred = new Deferred();
        this.requests.set(messageId, deferred);
        postMessage(
            {
                type: 'REQUEST',
                id: messageId,
                controller,
                method,
                params
            },
            document.location.href
        );
        return deferred.promise;
    }

    private onMessage(event: MessageEvent) {
        // console.log('Communication', 'onMessage', {event});
        // We only accept messages from ourselves
        if (event.source !== window) {
            return;
        }

        if (event.isTrusted && event.data && event.data.type === 'RESPONSE' && event.data.id) {
            const request = this.requests.get(event.data.id);
            if (request) {
                request.resolve(event.data.response);
                this.requests.delete(event.data.id);
            }
        }
    }
}
