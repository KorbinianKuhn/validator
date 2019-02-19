const {
  validateBoolean,
  validateSync,
  validate
} = require('./../../../../src/validator/default/validation/boolean');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');

describe('validator/default/validation/boolean', () => {
  const message = Message('en');

  test('validateBoolean() should return given value', () => {
    const actual = validateBoolean(true, { message, required: true });
    expect(actual).toBe(true);
  });

  test('validateBoolean() should return defaultValue', () => {
    const actual = validateBoolean(undefined, {
      message,
      required: true,
      defaultValue: false
    });
    expect(actual).toBe(false);
  });

  test('validateBoolean() with undefined should verify', () => {
    const actual = validateBoolean(undefined, {});
    expect(actual).toBe(undefined);
  });

  test('validateBoolean() with null should verify', () => {
    const actual = validateBoolean(null, {
      allowed: [null]
    });
    expect(actual).toBe(null);
  });

  test('validateBoolean() with undefined should throw', () => {
    helper.shouldThrow(
      () =>
        validateBoolean(undefined, {
          message,
          required: true,
          allowed: []
        }),
      'Required but is undefined.'
    );
  });

  test('validateBoolean() should throw', () => {
    helper.shouldThrow(
      () => validateBoolean('wrong', { message, required: true }),
      'Must be type boolean but is string.'
    );
  });

  test('validateBoolean() should parse to boolean', () => {
    let actual = validateBoolean('true', {
      message,
      required: true,
      parse: true
    });
    expect(actual).toBe(true);

    actual = validateBoolean(0, { message, required: true, parse: true });
    expect(actual).toBe(false);
  });

  test('validateBoolean() should try parse to boolean but fail', () => {
    helper.shouldThrow(
      () => validateBoolean('wrong', { message, required: true, parse: true }),
      'Must be type boolean but is string.'
    );
  });

  test('validateSync() should return given value', () => {
    const actual = validateSync(true, {});
    expect(actual).toBe(true);
  });

  test('validate() should return given value', async () => {
    const actual = await validate(false, {});
    expect(actual).toBe(false);
  });
});
