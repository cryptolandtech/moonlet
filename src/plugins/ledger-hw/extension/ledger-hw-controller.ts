import { IResponseData, Response } from './../../../utils/response';
import { Deferred } from '../../../utils/deferred';

interface IRequest {
    deferred: Deferred;
    timeout: any;
    msg: any[];
    sent: boolean;
}

const BRIDGE_URL = 'https://moonlet-wallet.firebaseapp.com/ledger-bridge/';

export class LedgerHwController {
    public bridgeReady: boolean = false;
    public iframe: HTMLIFrameElement;
    public requests: { [id: string]: IRequest } = {};

    constructor() {
        this.iframe = document.createElement('iframe');
        this.iframe.src = BRIDGE_URL;
        document.head.appendChild(this.iframe);

        window.addEventListener('message', ({ origin, data }) => {
            if (data.type === 'ledger-bridge-ready') {
                this.bridgeReady = true;
                for (const id of Object.keys(this.requests)) {
                    this.iframe.contentWindow.postMessage(
                        this.requests[id].msg[0],
                        this.requests[id].msg[1]
                    );
                    this.requests[id].timeout = setTimeout(
                        () => this.requests[id].deferred.reject('TIMEOUT'),
                        10000
                    );
                }
            }

            if (data.type === 'ledger-bridge-response' && this.requests[data.id]) {
                if (data.error) {
                    this.requests[data.id].deferred.reject(Response.reject(data.error));
                } else {
                    this.requests[data.id].deferred.resolve(Response.resolve(data.response));
                }

                clearTimeout(this.requests[data.id].timeout);
                delete this.requests[data.id];
            }
        });
    }

    public getAddress(sender, app, params, timeout?): Promise<any> {
        return this.request(app, 'getAddress', params, timeout);
    }

    public getAppInfo(sender, app, timeout?): Promise<any> {
        return this.request(app, 'getInfo', undefined, timeout);
    }

    public signTransaction(sender, app, params, timeout?): Promise<any> {
        return this.request(app, 'signTransaction', params);
    }

    private request(app, action, params?, timeout?): Promise<IResponseData> {
        const id = Math.random()
            .toString()
            .substr(2);

        const msg = {
            id,
            type: 'ledger-bridge',
            action,
            app,
            params,
            timeout
        };

        const deferred = new Deferred();
        this.requests[id] = {
            msg: [msg, '*'],
            sent: this.bridgeReady,
            deferred,
            timeout: null
        };

        if (this.bridgeReady) {
            this.iframe.contentWindow.postMessage(
                this.requests[id].msg[0],
                this.requests[id].msg[1]
            );
            this.requests[id].timeout = setTimeout(() => deferred.reject('TIMEOUT'), 10000);
        }

        return deferred.promise;
    }
}
