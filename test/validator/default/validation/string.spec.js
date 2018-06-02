const {
  validateString,
  validateSync,
  validate
} = require('./../../../../src/validator/default/validation/string');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');

describe('validator/default/validation/string', () => {
  const message = Message('en');

  test('validateString() should return given value', () => {
    const actual = validateString('test', { message, required: true });
    expect(actual).toBe('test');
  });

  test('validateString() should return defaultValue', () => {
    const actual = validateString(undefined, {
      message,
      required: true,
      defaultValue: 'test'
    });
    expect(actual).toBe('test');
  });

  test('validateString() with undefined should verify', () => {
    const actual = validateString(undefined, {});
    expect(actual).toBe(undefined);
  });

  test('validateString() with null should verify', () => {
    const actual = validateString(null, {
      allowed: [null]
    });
    expect(actual).toBe(null);
  });

  test('validateString() with undefined should throw', () => {
    helper.shouldThrow(
      () =>
        validateString(undefined, {
          message,
          required: true,
          allowed: []
        }),
      'Required but is undefined.'
    );
  });

  test('validateString() should throw', () => {
    helper.shouldThrow(
      () => validateString(true, { message, required: true }),
      'Must be type string but is boolean.'
    );
  });

  test('validateString() should return trimmed value', () => {
    const actual = validateString(' test  ', {
      trim: true
    });
    expect(actual).toBe('test');
  });

  test('validateString() empty string should throw', () => {
    helper.shouldThrow(
      () => validateString('', { message, empty: false }),
      'String is empty.'
    );
  });

  test('validateString() empty string should verify', () => {
    const actual = validateString('', {});
    expect(actual).toBe('');
  });

  test('validateString() min length should throw', () => {
    helper.shouldThrow(
      () => validateString('te', { message, min: 3 }),
      'Must have at least 3 characters.'
    );
  });

  test('validateString() min length should verify', () => {
    const actual = validateString('test', { min: 3 });
    expect(actual).toBe('test');
  });

  test('validateString() max length should throw', () => {
    helper.shouldThrow(
      () => validateString('test', { message, max: 3 }),
      'Must have at most 3 characters.'
    );
  });

  test('validateString() max length should verify', () => {
    const actual = validateString('te', { max: 3 });
    expect(actual).toBe('te');
  });

  test('validateString() length should throw', () => {
    helper.shouldThrow(
      () => validateString('te', { message, length: 3 }),
      'Must have exactly 3 characters.'
    );
  });

  test('validateString() length length should verify', () => {
    const actual = validateString('test', { length: 4 });
    expect(actual).toBe('test');
  });

  test('validateString() with regex should verify', () => {
    const actual = validateString('TEST', {
      regex: { pattern: /[A-Z]/, locales: {} }
    });
    expect(actual).toBe('TEST');
  });

  test('validateString() with regex should throw', () => {
    helper.shouldThrow(
      () =>
        validateString('test', {
          message,
          regex: { pattern: /[A-Z]/, locales: {} }
        }),
      'Value does not match regular expression.'
    );
  });

  test('validateString() with regex should return custom error message', () => {
    helper.shouldThrow(
      () =>
        validateString('test', {
          message,
          regex: {
            pattern: /[A-Z]/,
            locales: { en: 'Value does not match {{pattern}}.' }
          }
        }),
      'Value does not match /[A-Z]/.'
    );
  });

  test('validateString() with regex should return default error message', () => {
    helper.shouldThrow(
      () =>
        validateString('test', {
          message,
          regex: {
            pattern: /[A-Z]/,
            locales: { unknown: 'Value does not match {{pattern}}.' }
          }
        }),
      'Value does not match regular expression.'
    );
  });

  test('validateSync() should return given value', () => {
    const actual = validateSync('test', {});
    expect(actual).toBe('test');
  });

  test('validate() should return given value', async () => {
    const actual = await validate('test', {});
    expect(actual).toBe('test');
  });
});
