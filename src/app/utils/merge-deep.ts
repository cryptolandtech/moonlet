export const mergeDeep = <T extends object = object>(target: T, ...sources: T[]): T  => {
    if (!sources.length) {
      return target;
    }
    const source = sources.shift();
    if (source === undefined) {
      return target;
    }
  
    if (isMergebleObject(target) && isMergebleObject(source)) {
      Object.keys(source).forEach(function(key: string) {
        if (isMergebleObject(source[key])) {
          if (!target[key]) {
            target[key] = {};
          }
          mergeDeep(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      });
    }
  
    return mergeDeep(target, ...sources);
  };
  
  const isObject = (item: any): boolean => {
    return item !== null && typeof item === 'object';
  };
  
  const isMergebleObject = (item): boolean => {
    return isObject(item) && !Array.isArray(item);
  };


  /**
   * describe('merge', () => {
  it('should merge Objects and all nested Ones', () => {
    const obj1 = { a: { a1: 'A1'}, c: 'C', d: {} };
    const obj2 = { a: { a2: 'A2'}, b: { b1: 'B1'}, d: null };
    const obj3 = { a: { a1: 'A1', a2: 'A2'}, b: { b1: 'B1'}, c: 'C', d: null};
    expect(mergeObjects({}, obj1, obj2)).toEqual(obj3);
  });
  it('should behave like Object.assign on the top level', () => {
    const obj1 = { a: { a1: 'A1'}, c: 'C'};
    const obj2 = { a: undefined, b: { b1: 'B1'}};
    expect(mergeObjects({}, obj1, obj2)).toEqual(Object.assign({}, obj1, obj2));
  });
  it('should not merge array values, just override', () => {
    const obj1 = {a: ['A', 'B']};
    const obj2 = {a: ['C'], b: ['D']};
    expect(mergeObjects({}, obj1, obj2)).toEqual({a: ['C'], b: ['D']});
  });
  it('typed merge', () => {
    expect(mergeObjects<TestPosition>(new TestPosition(0, 0), new TestPosition(1, 1)))
      .toEqual(new TestPosition(1, 1));
  });
});

class TestPosition {
  constructor(public x: number = 0, public y: number = 0) {\/*empty*\describe('merge', () => {
  it('should merge Objects and all nested Ones', () => {
    const obj1 = { a: { a1: 'A1'}, c: 'C', d: {} };
    const obj2 = { a: { a2: 'A2'}, b: { b1: 'B1'}, d: null };
    const obj3 = { a: { a1: 'A1', a2: 'A2'}, b: { b1: 'B1'}, c: 'C', d: null};
    expect(mergeObjects({}, obj1, obj2)).toEqual(obj3);
  });
  it('should behave like Object.assign on the top level', () => {
    const obj1 = { a: { a1: 'A1'}, c: 'C'};
    const obj2 = { a: undefined, b: { b1: 'B1'}};
    expect(mergeObjects({}, obj1, obj2)).toEqual(Object.assign({}, obj1, obj2));
  });
  it('should not merge array values, just override', () => {
    const obj1 = {a: ['A', 'B']};
    const obj2 = {a: ['C'], b: ['D']};
    expect(mergeObjects({}, obj1, obj2)).toEqual({a: ['C'], b: ['D']});
  });
  it('typed merge', () => {
    expect(mergeObjects<TestPosition>(new TestPosition(0, 0), new TestPosition(1, 1)))
      .toEqual(new TestPosition(1, 1));
  });
});

class TestPosition {
  constructor(public x: number = 0, public y: number = 0) {\/*empty*\/}
}
   */