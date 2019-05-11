// import { Blockchain } from 'moonlet-core/src/core/blockchain';
// import { IResponseData, Response } from './../../../utils/response';
// import { WalletManager } from './wallet-manager';
// import { FeeOptions } from '../../../utils/blockchain/types';
// import { Runtime, browser } from 'webextension-polyfill-ts';

// interface IAccessList {
//     [siteDomain: string]: Array<{
//         blockchain: Blockchain;
//         address: string;
//     }>;
// }

// interface ICommunication {
//     id: string;
//     initiator: Runtime.MessageSender;
//     data?: any;
//     onMessage: (data: IResponseData) => any;
// }

// interface ICommunications {
//     [id: string]: ICommunication;
// }

// /**
//  * Handles messages from external sources sent via content script
//  */
// export class RemoteInterface {
//     // instance of wallet manager controller
//     private walletManager: WalletManager;

//     // map of domains-accounts user has allowed access
//     private accessList: IAccessList = {};

//     // requests sent from webpages
//     private communications: ICommunications = {};

//     constructor(walletManager: WalletManager) {
//         this.walletManager = walletManager;
//     }

//     public async getAccount(
//         sender: Runtime.MessageSender,
//         blockchain: Blockchain
//     ): Promise<IResponseData> {
//         const hostname = new URL(sender.url).hostname;
//         if (this.accessList[hostname]) {
//             const account = this.accessList[hostname].find(item => item.blockchain === blockchain);
//             if (account) {
//                 return Promise.resolve(Response.resolve(account));
//             }
//         }
//         return new Promise(async resolve => {
//             try {
//                 const communication = this.createCommunication(
//                     sender,
//                     {
//                         siteInfo: sender.tab,
//                         blockchain
//                     },
//                     (response: IResponseData) => {
//                         this.endCommunication(communication.id);
//                         if (!response.error) {
//                             this.authorize(
//                                 sender.url,
//                                 response.data.blockchain,
//                                 response.data.address
//                             );
//                         }

//                         resolve(response);
//                     }
//                 );

//                 // open window;
//                 const window = await browser.windows.create({
//                     url: `index.html?id=${communication.id}#/request-account-access`,
//                     type: 'popup',
//                     width: 350,
//                     height: 605
//                 });

//                 const onWindowClose = id => {
//                     if (id === window.id) {
//                         browser.windows.onRemoved.removeListener(onWindowClose);
//                         this.endCommunication(communication.id);
//                         resolve(Response.reject('WINDOW_CLOSE'));
//                     }
//                 };
//                 browser.windows.onRemoved.addListener(onWindowClose);
//             } catch (e) {
//                 resolve(Response.reject(e.code || 'GENERIC_ERROR', e.message.e.data));
//             }
//         });
//     }

//     public sendMessage(
//         sender: Runtime.MessageSender,
//         communicationId: string,
//         data: any
//     ): IResponseData {
//         if (this.hasAccessToCommunication(sender, communicationId)) {
//             this.communications[communicationId].onMessage(data);
//             return Response.resolve();
//         }
//         return Response.reject('UNAUTHORIZED_ACCESS');
//     }

//     public getData(sender: Runtime.MessageSender, communicationId: string) {
//         if (this.hasAccessToCommunication(sender, communicationId)) {
//             return Response.resolve(this.communications[communicationId].data);
//         }
//         return Response.reject('UNAUTHORIZED_ACCESS');
//     }

//     public async getBalance(
//         sender: Runtime.MessageSender,
//         blockchain: Blockchain,
//         address: string
//     ): Promise<IResponseData> {
//         if (this.hasAccessToAccount(sender, blockchain, address)) {
//             return this.walletManager.getBalance(sender, blockchain, address);
//         }
//         return Response.reject('UNAUTHORIZED_ACCESS');
//     }

//     public async getNonce(
//         sender: Runtime.MessageSender,
//         blockchain: Blockchain,
//         address: string
//     ): Promise<IResponseData> {
//         if (this.hasAccessToAccount(sender, blockchain, address)) {
//             return this.walletManager.getNonce(sender, blockchain, address);
//         }
//         return Response.reject('UNAUTHORIZED_ACCESS');
//     }

//     public async transfer(
//         sender: Runtime.MessageSender,
//         blockchain: Blockchain,
//         fromAddress: string,
//         toAddress: string,
//         amount: string,
//         feeOptions: FeeOptions
//     ): Promise<IResponseData> {
//         if (this.hasAccessToAccount(sender, blockchain, fromAddress)) {
//             return new Promise(async resolve => {
//                 try {
//                     const communication = this.createCommunication(
//                         sender,
//                         {
//                             siteInfo: sender.tab,
//                             blockchain,
//                             fromAddress,
//                             toAddress,
//                             amount,
//                             feeOptions
//                         },
//                         (response: IResponseData) => {
//                             this.endCommunication(communication.id);
//                             resolve(response);
//                         }
//                     );

//                     // open window;
//                     const window = await browser.windows.create({
//                         url: `index.html?id=${communication.id}#/transaction-confirmation`,
//                         type: 'popup',
//                         width: 350,
//                         height: 605
//                     });

//                     const onWindowClose = id => {
//                         if (id === window.id) {
//                             browser.windows.onRemoved.removeListener(onWindowClose);
//                             this.endCommunication(communication.id);
//                             resolve(Response.reject('WINDOW_CLOSE'));
//                         }
//                     };
//                     browser.windows.onRemoved.addListener(onWindowClose);
//                 } catch (e) {
//                     resolve(Response.reject(e.code || 'GENERIC_ERROR', e.message.e.data));
//                 }
//             });
//         }
//         return Response.reject('UNAUTHORIZED_ACCESS');
//     }

//     private createCommunication(
//         sender: Runtime.MessageSender,
//         data: any = {},
//         onMessage?: (data) => any
//     ): ICommunication {
//         const communication = {
//             id: `${Date.now()}${Math.random()
//                 .toString()
//                 .substr(2)}`,
//             initiator: sender,
//             data,
//             onMessage
//         };

//         this.communications[communication.id] = communication;
//         return communication;
//     }

//     private endCommunication(communicationId: string) {
//         delete this.communications[communicationId];
//     }

//     private hasAccessToCommunication(
//         sender: Runtime.MessageSender,
//         communicationId: string
//     ): boolean {
//         // not an issue yet
//         // TODO: verify if sender can access communication
//         return true;
//     }

//     private hasAccessToAccount(
//         sender: Runtime.MessageSender,
//         blockchain: Blockchain,
//         address: string
//     ): boolean {
//         const hostname = new URL(sender.url).hostname;
//         const account = (this.accessList[hostname] || []).find(item => {
//             return item.blockchain === blockchain && item.address === address;
//         });
//         return account ? true : false;
//     }

//     private authorize(url: string, blockchain: Blockchain, address: string) {
//         const hostname = new URL(url).hostname;

//         if (!this.accessList[hostname]) {
//             this.accessList[hostname] = [];
//         }

//         const account = this.accessList[hostname].find(item => {
//             return item.blockchain === blockchain && item.address === address;
//         });

//         if (!account) {
//             this.accessList[hostname].push({
//                 blockchain,
//                 address
//             });
//         }
//     }
// }
