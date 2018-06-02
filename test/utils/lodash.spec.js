const { defaultToAny } = require('./../../src/utils/lodash');

describe('lodash', () => {
  test('defaultToAny() should verify', () => {
    const result = defaultToAny(undefined, null, 'test', 'hello');
    expect(result).toBe('test');
  });

  test('defaultToAny() return undefined', () => {
    const result = defaultToAny(undefined, null);
    expect(result).toBe(undefined);
  });
});
