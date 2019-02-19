const {
  validateNumber,
  validateSync,
  validate
} = require('./../../../../src/validator/default/validation/number');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');

describe('validator/default/validation/number', () => {
  const message = Message('en');

  test('validateNumber() should return given value', () => {
    const actual = validateNumber(2.4, { message, required: true });
    expect(actual).toBe(2.4);
  });

  test('validateNumber() should return defaultValue', () => {
    const actual = validateNumber(undefined, {
      message,
      required: true,
      defaultValue: 2
    });
    expect(actual).toBe(2);
  });

  test('validateNumber() with undefined should verify', () => {
    const actual = validateNumber(undefined, {});
    expect(actual).toBe(undefined);
  });

  test('validateNumber() with null should verify', () => {
    const actual = validateNumber(null, {
      allowed: [null]
    });
    expect(actual).toBe(null);
  });

  test('validateNumber() with undefined should throw', () => {
    helper.shouldThrow(
      () =>
        validateNumber(undefined, {
          message,
          required: true,
          allowed: []
        }),
      'Required but is undefined.'
    );
  });

  test('validateNumber() should throw', () => {
    helper.shouldThrow(
      () => validateNumber('wrong', { message, required: true }),
      'Must be a number.'
    );
  });

  test('validateNumber() should parse to number', () => {
    let actual = validateNumber('2.2', {
      message,
      required: true,
      parse: true
    });
    expect(actual).toBe(2.2);
  });

  test('validateNumber() should parse to integer', () => {
    let actual = validateNumber('2', {
      message,
      required: true,
      parse: true,
      integer: true
    });
    expect(actual).toBe(2);
  });

  test('validateNumber() should not parse to integer', () => {
    helper.shouldThrow(
      () =>
        validateNumber('2.2', {
          message,
          required: true,
          parse: true,
          integer: true
        }),
      'No decimal places allowed.'
    );
  });

  test('validateNumber() should try parse to number but fail', () => {
    helper.shouldThrow(
      () => validateNumber('wrong', { message, required: true, parse: true }),
      'Must be a number.'
    );
  });

  test('validateNumber() number for integer should fail', () => {
    helper.shouldThrow(
      () => validateNumber(2.2, { message, required: true, integer: true }),
      'No decimal places allowed.'
    );
  });

  test('validateNumber() string for integer should fail', () => {
    helper.shouldThrow(
      () => validateNumber('2.2', { message, required: true, integer: true }),
      'Must be an integer.'
    );
  });

  test('validateNumber() min should fail', () => {
    helper.shouldThrow(
      () => validateNumber(1.2, { message, min: 2 }),
      'Must be at minimum 2.'
    );

    helper.shouldThrow(
      () => validateNumber(1, { message, min: 2, integer: true }),
      'Must be at minimum 2.'
    );
  });

  test('validateNumber() min should verify', () => {
    let actual = validateNumber(2.2, { message, min: 2 });
    expect(actual).toBe(2.2);

    actual = validateNumber(3, { message, min: 2, integer: true });
    expect(actual).toBe(3);
  });

  test('validateNumber() max should fail', () => {
    helper.shouldThrow(
      () => validateNumber(3.2, { message, max: 2 }),
      'Must be at maximum 2.'
    );

    helper.shouldThrow(
      () => validateNumber(3, { message, max: 2, integer: true }),
      'Must be at maximum 2.'
    );
  });

  test('validateNumber() max should verify', () => {
    let actual = validateNumber(1.2, { message, max: 2 });
    expect(actual).toBe(1.2);

    actual = validateNumber(1, { message, max: 2, integer: true });
    expect(actual).toBe(1);
  });

  test('validateNumber() less should fail', () => {
    helper.shouldThrow(
      () => validateNumber(3.2, { message, less: 2 }),
      'Must be less than 2.'
    );

    helper.shouldThrow(
      () => validateNumber(3, { message, less: 2, integer: true }),
      'Must be less than 2.'
    );
  });

  test('validateNumber() less should verify', () => {
    let actual = validateNumber(1.2, { message, less: 2 });
    expect(actual).toBe(1.2);

    actual = validateNumber(1, { message, less: 2, integer: true });
    expect(actual).toBe(1);
  });

  test('validateNumber() greater should fail', () => {
    helper.shouldThrow(
      () => validateNumber(1.2, { message, greater: 2 }),
      'Must be greater than 2.'
    );

    helper.shouldThrow(
      () => validateNumber(1, { message, greater: 2, integer: true }),
      'Must be greater than 2.'
    );
  });

  test('validateNumber() greater should verify', () => {
    let actual = validateNumber(2.2, { message, greater: 2 });
    expect(actual).toBe(2.2);

    actual = validateNumber(3, { message, greater: 2, integer: true });
    expect(actual).toBe(3);
  });

  test('validateNumber() positive should fail', () => {
    helper.shouldThrow(
      () => validateNumber(-1.3, { message, positive: true }),
      'Must be a positive number.'
    );

    helper.shouldThrow(
      () => validateNumber(0, { message, positive: true, integer: true }),
      'Must be a positive number.'
    );
  });

  test('validateNumber() positive should verify', () => {
    let actual = validateNumber(1.2, { message, positive: true });
    expect(actual).toBe(1.2);

    actual = validateNumber(3, { message, positive: true, integer: true });
    expect(actual).toBe(3);
  });

  test('validateNumber() negative should fail', () => {
    helper.shouldThrow(
      () => validateNumber(1.3, { message, negative: true }),
      'Must be a negative number.'
    );

    helper.shouldThrow(
      () => validateNumber(0, { message, negative: true, integer: true }),
      'Must be a negative number.'
    );
  });

  test('validateNumber() negative should verify', () => {
    let actual = validateNumber(-1.2, { message, negative: true });
    expect(actual).toBe(-1.2);

    actual = validateNumber(-3, { message, negative: true, integer: true });
    expect(actual).toBe(-3);
  });

  test('validateSync() should return given value', () => {
    const actual = validateSync(2, {});
    expect(actual).toBe(2);
  });

  test('validate() should return given value', async () => {
    const actual = await validate(2.5812, {});
    expect(actual).toBe(2.5812);
  });
});
