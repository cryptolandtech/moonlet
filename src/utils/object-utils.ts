const replacer = (key, value) => {
    if (value.__proto__ === Map.prototype) {
        return {
            _type: 'map',
            map: Array.from(value)
        };
    } else {
        return value;
    }
};

const reviver = (key, value) => {
    if (value._type === 'map') {
        return new Map(value.map);
    } else {
        return value;
    }
};

export const serialize = obj => {
    return JSON.stringify(obj, replacer);
};

export const deserialize = objStr => {
    return JSON.parse(objStr, reviver);
};
