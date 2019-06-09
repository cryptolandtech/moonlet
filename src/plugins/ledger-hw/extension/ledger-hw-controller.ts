import { ITransactionOptions } from './../iledger-hw-plugin';
import { IResponseData, Response } from './../../../utils/response';
import { Deferred } from '../../../utils/deferred';
import * as uuid from 'uuid/v4';

interface IRequest {
    deferred: Deferred;
    timeoutMs: number;
    timeout: any;
    msg: any[];
    sent: boolean;
}

const BRIDGE_URL = 'https://static.moonlet.xyz/ledger-bridge/';
// const BRIDGE_URL = 'https://localhost:8081/?debug=1';
const REQUEST_TIMEOUT = 30000;

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
                        this.requests[id].timeoutMs || REQUEST_TIMEOUT
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

    public signTransaction(sender, app, params: ITransactionOptions, timeout?): Promise<any> {
        return this.request(app, 'signTransaction', params);
    }

    private request(app, action, params?, timeout?): Promise<IResponseData> {
        const id = uuid();

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
            timeout: null,
            timeoutMs: timeout
        };

        if (this.bridgeReady) {
            this.iframe.contentWindow.postMessage(
                this.requests[id].msg[0],
                this.requests[id].msg[1]
            );
            this.requests[id].timeout = setTimeout(
                () => deferred.reject('TIMEOUT'),
                timeout || REQUEST_TIMEOUT
            );
        }

        return deferred.promise;
    }
}
