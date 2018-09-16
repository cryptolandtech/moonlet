import { mergeDeep } from './../merge-deep';

interface ITest {
    key?: string;
    key2?: string;
    deep?: {
        deeper?: {
            key?: string;
            key2?: string;
        };
        deeper2?: {
            key: string;
        };
    };
}

describe('utils/merge-deep', () => {
    it('should return target if no sources given', () => {
        const a = {
            key: 'value'
        };

        const b = mergeDeep(a);

        expect(b).toBe(a);
        expect(b).toEqual({
            key: 'value'
        });
    });

    it('should return target if source is undefined', () => {
        const a = {
            key: 'value'
        };

        const b = mergeDeep(a, undefined);

        expect(b).toBe(a);
        expect(b).toEqual({
            key: 'value'
        });
    });

    it('should not merge arrays', () => {
        const b = mergeDeep([1], [2]);
        expect(b).toEqual([1]);
    });

    it('should merge 2 objects', () => {
        const a = {
            key: 'value'
        };

        const b = {
            key2: 'value2'
        };

        const result = mergeDeep<ITest>(a, b);

        expect(result).toEqual({
            key: 'value',
            key2: 'value2'
        });
        expect(a).toBe(result);
        expect(b).toEqual({
            key2: 'value2'
        });
    });

    it('should merge deep', () => {
        const a = {
            deep: {
                deeper: {
                    key: 'value'
                }
            }
        };

        const b = {
            deep: {
                deeper: {
                    key2: 'value2'
                },
                deeper2: {
                    key: 'value'
                }
            }
        };

        const c = mergeDeep(a, b as any);

        expect(c).toBe(a);
        expect(a).toEqual({
            deep: {
                deeper: {
                    key: 'value',
                    key2: 'value2'
                },
                deeper2: {
                    key: 'value'
                }
            }
        });
    });

    it('should merge more than 2 objects', () => {
        const a = {
            key: 'value'
        };

        const b = {
            key2: 'value'
        };

        const c = {
            key: 'valueNew',
            key2: 'value2New'
        };

        const d = {
            key: 'finalValue',
            key2: 'finalValue2'
        };

        expect(mergeDeep({}, a, b, c, d)).toEqual({
            key: 'finalValue',
            key2: 'finalValue2'
        });
    });
});
