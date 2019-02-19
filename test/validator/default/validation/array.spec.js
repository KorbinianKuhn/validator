const {
  validateArray,
  validateSync,
  validate,
  validateItemsSync,
  validateItemsAsync
} = require('./../../../../src/validator/default/validation/array');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');
const {
  StringFactory
} = require('./../../../../src/validator/default/types/string');

describe('validator/default/validation/array', () => {
  const message = Message('en');

  test('validateArray() should return given value', () => {
    const actual = validateArray([], { message, required: true });
    expect(actual).toEqual([]);
  });

  test('validateArray() should return defaultValue', () => {
    const actual = validateArray(undefined, {
      message,
      required: true,
      defaultValue: []
    });
    expect(actual).toEqual([]);
  });

  test('validateArray() with undefined should verify', () => {
    const actual = validateArray(undefined, {});
    expect(actual).toBe(undefined);
  });

  test('validateArray() with null should verify', () => {
    const actual = validateArray(null, {
      allowed: [null]
    });
    expect(actual).toBe(null);
  });

  test('validateArray() with undefined should throw', () => {
    helper.shouldThrow(
      () =>
        validateArray(undefined, {
          message,
          required: true,
          allowed: []
        }),
      'Required but is undefined.'
    );
  });

  test('validateArray() should throw', () => {
    helper.shouldThrow(
      () => validateArray('wrong', { message, required: true }),
      'Must be type array but is string.'
    );
  });

  test('validateArray() should parse to array', () => {
    const actual = validateArray('true,false', {
      message,
      required: true,
      parse: true
    });
    expect(actual).toEqual(['true', 'false']);
  });

  test('validateArray() should try parse to array but fail', () => {
    helper.shouldThrow(
      () => validateArray(2, { message, required: true, parse: true }),
      'Must be type array but is number.'
    );
  });

  test('validateArray() empty array should fail', () => {
    helper.shouldThrow(
      () => validateArray([], { message, empty: false }),
      'Array is empty.'
    );
  });

  test('validateArray() empty array should verify', () => {
    const actual = validateArray([], {
      empty: true
    });
    expect(actual).toEqual([]);
  });

  test('validateArray() min length should fail', () => {
    helper.shouldThrow(
      () => validateArray([], { message, min: 1 }),
      'Must have at least 1 items.'
    );
  });

  test('validateArray() min length should verify', () => {
    const actual = validateArray(['test'], {
      min: 1
    });
    expect(actual).toEqual(['test']);
  });

  test('validateArray() max length should fail', () => {
    helper.shouldThrow(
      () => validateArray(['test', 'test'], { message, max: 1 }),
      'Must have at most 1 items.'
    );
  });

  test('validateArray() max length should verify', () => {
    const actual = validateArray(['test'], {
      max: 1
    });
    expect(actual).toEqual(['test']);
  });

  test('validateArray() length should fail', () => {
    helper.shouldThrow(
      () => validateArray(['test', 'test'], { message, length: 1 }),
      'Must have exactly 1 items.'
    );
  });

  test('validateArray() length should verify', () => {
    const actual = validateArray(['test'], {
      length: 1
    });
    expect(actual).toEqual(['test']);
  });

  test('validateArray() duplicate items should fail', () => {
    helper.shouldThrow(
      () => validateArray(['test', 'test'], { message, unique: true }),
      'Items must be unique.'
    );
  });

  test('validateArray() duplicate items should verify', () => {
    const actual = validateArray(['test', 'test'], {
      unique: false
    });
    expect(actual).toEqual(['test', 'test']);
  });

  test('validateItemsSync() should verify', () => {
    const itemSchema = StringFactory({}, { message });
    const actual = validateItemsSync(['test'], itemSchema);
    expect(actual).toEqual(['test']);
  });

  test('validateItemsSync() should fail', () => {
    const itemSchema = StringFactory({}, { message });
    helper.shouldThrow(() => validateItemsSync([true], itemSchema), {
      '0': 'Must be type string but is boolean.'
    });
  });

  test('validateItemsSync() without itemSchema should verify', () => {
    const actual = validateItemsSync(['test']);
    expect(actual).toEqual(['test']);
  });

  test('validateItemsAsync() should verify', async () => {
    const itemSchema = StringFactory({}, { message });
    const actual = await validateItemsAsync(['test'], itemSchema);
    expect(actual).toEqual(['test']);
  });

  test('validateItemsAsync() should fail', async () => {
    const itemSchema = StringFactory({}, { message });
    await helper.shouldEventuallyThrow(validateItemsAsync([true], itemSchema), {
      '0': 'Must be type string but is boolean.'
    });
  });

  test('validateItemsAsync() without itemSchema should verify', async () => {
    const actual = await validateItemsAsync(['test']);
    expect(actual).toEqual(['test']);
  });

  test('validateSync() should return given value', () => {
    const actual = validateSync([], {});
    expect(actual).toEqual([]);
  });

  test('validate() should return given value', async () => {
    const actual = await validate([], {});
    expect(actual).toEqual([]);
  });
});
