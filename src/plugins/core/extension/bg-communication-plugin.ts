import {
    IBackgroundMessage,
    BackgroundMessageType,
    BackgroundMessageController
} from '../../../platforms/extension/types';
import { Runtime } from 'webextension-polyfill-ts';
import { Deferred } from '../../../utils/deferred';
import { Response } from '../../../utils/response';
import * as uuid from 'uuid/v4';

const REQUEST_TIMEOUT = 8000; // ms

export interface IRequestInfo {
    timeout: any;
    deferred: Deferred;
}

export class BgCommunicationPlugin {
    protected controller: BackgroundMessageController;
    protected disableTimeout = false;
    private port: Runtime.Port;
    private requests: Map<string, IRequestInfo> = new Map();

    constructor(port: Runtime.Port, controller: BackgroundMessageController) {
        if (port) {
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
    }

    public async callAction(action, params?, timeout?: number) {
        const message: IBackgroundMessage = {
            id: uuid(),
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

    protected sanitizeMessageForErrorReporting(message: IBackgroundMessage) {
        return message;
    }

    private getRequestTimeout(message, deferred: Deferred, timeout?: number) {
        if (this.disableTimeout) {
            return undefined;
        }

        return setTimeout(() => {
            this.requests.delete(message.id);
            deferred.reject(
                Response.reject(
                    'REQUEST_TIMEOUT',
                    `Background Request timed out. (controller: ${this.controller}, action: ${
                        ((message || {}).request || {}).action
                    })`,
                    this.sanitizeMessageForErrorReporting(message)
                )
            );
        }, timeout || REQUEST_TIMEOUT);
    }
}
