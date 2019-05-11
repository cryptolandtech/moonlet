import { IResponseData } from '../../../utils/response';

type Constructable = new (...args) => object;
export function extensionPluginToWeb<BC extends Constructable>(Base: BC) {
    return class extends Base {
        protected ctrl;

        public async callAction(action, params) {
            if (typeof this.ctrl[action] === 'function') {
                const response: IResponseData = await this.ctrl[action](null, ...params);

                if (response.error) {
                    return Promise.reject(response);
                } else {
                    return Promise.resolve(response.data);
                }
            }
        }
    };
}
