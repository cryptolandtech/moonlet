import { Response } from '../../../../../utils/response';

export class BaseCommunicationController {
    public async _onMessage(event: MessageEvent) {
        // We only accept messages from ourselves
        if (event.source !== window) {
            return;
        }

        if (
            event.isTrusted &&
            event.data &&
            event.data.type === 'REQUEST' &&
            event.data.controller === this.constructor.name &&
            event.data.method &&
            event.data.method !== 'listen' &&
            event.data.id &&
            typeof this[event.data.method.replace(/^_/, '')] === 'function'
        ) {
            try {
                const response = await this[event.data.method.replace(/^_/, '')](
                    ...event.data.params
                );
                window.postMessage(
                    {
                        ...event.data,
                        type: 'RESPONSE',
                        response
                    },
                    document.location.href
                );
            } catch (e) {
                window.postMessage(
                    {
                        ...event.data,
                        type: 'RESPONSE',
                        response: Response.reject(e.code || 'GENERIC_ERROR', e.message, e.data)
                    },
                    document.location.href
                );
            }
        }
    }

    public listen() {
        window.addEventListener('message', this._onMessage.bind(this));
    }
}
