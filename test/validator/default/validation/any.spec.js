const {
  validateOnly,
  validateNot,
  validateFunctionSync,
  validateFunctionAsync,
  validateAny,
  validateSync,
  validate
} = require('./../../../../src/validator/default/validation/any');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');

describe('validator/default/validation/any', () => {
  const message = Message('en');

  test('validateOnly() should throw', () => {
    helper.shouldThrow(
      () => validateOnly(['test', 'test2'], 'hello', message),
      "Only 'test, test2' is allowed."
    );
  });

  test('validateOnly() should not throw', () => {
    validateOnly(['test'], 'test', message);
  });

  test('validateOnly() with undefined only should not throw', () => {
    validateOnly(undefined, 'test', message);
  });

  test('validateNot() should throw', () => {
    helper.shouldThrow(
      () => validateNot(['test'], 'test', message),
      'Is not allowed.'
    );
  });

  test('validateNot() should not throw', () => {
    validateNot(['test'], 'hello', message);
  });

  test('validateNot() with undefined not should not throw', () => {
    validateNot(undefined, 'test', message);
  });

  test('validateFunctionSync() should throw', () => {
    const func = () => {
      throw new Error('message');
    };
    helper.shouldThrow(
      () => validateFunctionSync(func, 'test', message),
      'message'
    );
  });

  test('validateFunctionSync() should not throw', () => {
    const func = value => value;
    const actual = validateFunctionSync(func, 'test', message);
    expect(actual).toBe('test');
  });

  test('validateFunctionSync() without function should not throw', () => {
    const actual = validateFunctionSync(undefined, 'test', message);
    expect(actual).toBe('test');
  });

  test('validateFunctionSync() should return function value', () => {
    const func = () => 'hello';
    const actual = validateFunctionSync(func, 'test', message);
    expect(actual).toBe('hello');
  });

  test('validateFunctionAsync() should throw', async () => {
    const func = () => Promise.reject('message');
    await helper.shouldEventuallyThrow(
      validateFunctionAsync(func, 'test', message),
      'message'
    );
  });

  test('validateFunctionAsync() should not throw', async () => {
    const func = value => Promise.resolve(value);
    const actual = await validateFunctionAsync(func, 'test', message);
    expect(actual).toBe('test');
  });

  test('validateFunctionAsync() without function should not throw', async () => {
    const actual = await validateFunctionAsync(undefined, 'test', message);
    expect(actual).toBe('test');
  });

  test('validateFunctionAsync() should return function value', async () => {
    const func = () => Promise.resolve('hello');
    const actual = await validateFunctionAsync(func, 'test', message);
    expect(actual).toBe('hello');
  });

  test('validateAny() should return given value', () => {
    const actual = validateAny('test', { message, required: true });
    expect(actual).toBe('test');
  });

  test('validateAny() should return defaultValue', () => {
    const actual = validateAny(undefined, {
      message,
      required: true,
      defaultValue: 'test'
    });
    expect(actual).toBe('test');
  });

  test('validateAny() with undefined should verify', () => {
    const actual = validateAny(undefined, {});
    expect(actual).toBe(undefined);
  });

  test('validateAny() with null should verify', () => {
    const actual = validateAny(null, {
      allowed: [null]
    });
    expect(actual).toBe(null);
  });

  test('validateAny() with undefined should throw', () => {
    helper.shouldThrow(
      () =>
        validateAny(undefined, {
          message,
          required: true,
          allowed: []
        }),
      'Required but is undefined.'
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

  test('validateAny() with nullAsUndefined false should return correct error message', () => {
    helper.shouldThrow(
      () =>
        validateAny(null, {
          message,
          required: true,
          nullAsUndefined: false
        }),
      'Null is not allowed.'
    );
  });

  test('validateAny() with nullAsUndefined true should return correct error message', () => {
    helper.shouldThrow(
      () =>
        validateAny(null, {
          message,
          required: true,
          nullAsUndefined: true
        }),
      'Required but is null.'
    );
  });
});
