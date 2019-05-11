import { IResponseData } from './../../../utils/response';

const getMethods = obj => {
    const methods = [];
    let proto = Object.getPrototypeOf(obj);

    while (proto && proto !== Object.prototype) {
        methods.push(...Object.getOwnPropertyNames(proto).filter(m => m !== 'constructor'));
        proto = Object.getPrototypeOf(proto);
    }

    return methods;
};

export const bgControllerToPlugin = (controller): any => {
    class PluginClass {}

    for (const method of getMethods(controller)) {
        if (typeof controller[method] === 'function') {
            PluginClass.prototype[method] = async (...params) => {
                const response: IResponseData = await controller[method](null, ...params);

                if (response.error) {
                    return Promise.reject(response);
                } else {
                    return Promise.resolve(response.data);
                }
            };
        }
    }

    return PluginClass;
};
