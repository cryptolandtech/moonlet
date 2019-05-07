import {
    IBackgroundMessage,
    BackgroundMessageType,
    BackgroundMessageController,
    ConnectionPort
} from './types';
import { browser, Runtime } from 'webextension-polyfill-ts';
import { Deferred } from '../app/utils/deferred';
import { Response } from '../app/utils/response';

const REQUEST_TIMEOUT = 8000; // ms

export interface IRequestInfo {
    timeout: any;
    deferred: Deferred;
}

export class ExtensionBaseProvider {
    protected controller: BackgroundMessageController;
    private port: Runtime.Port;
    private requests: Map<string, IRequestInfo> = new Map();

    constructor(port: Runtime.Port, controller: BackgroundMessageController) {
        this.port = port;
        this.controller = controller;
        this.port.onMessage.addListener((message: IBackgroundMessage) => {
            if (
                message.id &&
                message.type === BackgroundMessageType.RESPONSE &&
                message.response &&
                this.requests.has(message.id)
            ) {
                const requestInfo = this.requests.get(message.id);
                clearTimeout(requestInfo.timeout);

                if (message.response.error) {
                    requestInfo.deferred.reject(message.response);
                } else {
                    requestInfo.deferred.resolve(message.response.data);
                }

                this.requests.delete(message.id);
            }
        });
    }

    public async callAction(action, params?, timeout?: number) {
        const message: IBackgroundMessage = {
            id: Math.random()
                .toString()
                .substr(2),
            type: BackgroundMessageType.REQUEST,
            request: {
                controller: this.controller,
                action,
                params
            }
        };

        const deferred = new Deferred();
        this.requests.set(message.id, {
            timeout: this.getRequestTimeout(message, deferred, timeout),
            deferred
        });
        this.port.postMessage(message);
        return deferred.promise;
    }

    private getRequestTimeout(message, deferred: Deferred, timeout?: number) {
        return setTimeout(() => {
            this.requests.delete(message.id);
            deferred.reject(Response.reject('REQUEST_TIMEOUT', message));
        }, timeout || REQUEST_TIMEOUT);
    }
}
