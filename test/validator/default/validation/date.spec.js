const {
  validateDate,
  validateSync,
  validate
} = require('./../../../../src/validator/default/validation/date');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');
const moment = require('moment');

describe('validator/default/validation/date', () => {
  const message = Message('en');
  const validISOString = '2018-01-01T00:00:00.000Z';

  test('validateDate() should return given value', () => {
    const actual = validateDate(validISOString, { message, required: true });
    expect(actual).toBe(validISOString);
  });

  test('validateDate() should return defaultValue', () => {
    const actual = validateDate(undefined, {
      message,
      required: true,
      defaultValue: validISOString
    });
    expect(actual).toBe(validISOString);
  });

  test('validateDate() with undefined should verify', () => {
    const actual = validateDate(undefined, {});
    expect(actual).toBe(undefined);
  });

  test('validateDate() with null should verify', () => {
    const actual = validateDate(null, {
      allowed: [null]
    });
    expect(actual).toBe(null);
  });

  test('validateDate() with undefined should throw', () => {
    helper.shouldThrow(
      () =>
        validateDate(undefined, {
          message,
          required: true,
          allowed: []
        }),
      'Required but is undefined.'
    );
  });

  test('validateDate() should throw', () => {
    helper.shouldThrow(
      () =>
        validateDate('123213', {
          message,
          required: true,
          strict: true,
          format: 'YYYY-MM-DD'
        }),
      'Must be a valid date with the format YYYY-MM-DD.'
    );
  });

  test('validateDate() should parse to date', () => {
    let actual = validateDate(validISOString, {
      message,
      required: true,
      parse: true
    });
    expect(moment(actual).toISOString()).toBe(validISOString);
  });

  test('validateDate() should parse to utc date', () => {
    let actual = validateDate(validISOString, {
      message,
      required: true,
      parse: true,
      utc: true
    });
    expect(moment.utc(actual).toISOString()).toBe(validISOString);
  });

  test('validateDate() min date should verify', () => {
    const actual = validateDate(validISOString, {
      message,
      min: '2017-01-01'
    });
    expect(actual).toBe(validISOString);
  });

  test('validateDate() min date should fail', () => {
    helper.shouldThrow(
      () =>
        validateDate(validISOString, {
          message,
          min: '2019-01-01'
        }),
      'Must be at minimum 2019-01-01.'
    );
  });

  test('validateDate() max date should verify', () => {
    const actual = validateDate(validISOString, {
      message,
      max: '2019-01-01'
    });
    expect(actual).toBe(validISOString);
  });

  test('validateDate() max date should fail', () => {
    helper.shouldThrow(
      () =>
        validateDate(validISOString, {
          message,
          max: '2017-01-01'
        }),
      'Must be at maximum 2017-01-01.'
    );
  });

  test('validateSync() should return given value', () => {
    const actual = validateSync(validISOString, {});
    expect(actual).toBe(validISOString);
  });

  test('validate() should return given value', async () => {
    const actual = await validate(validISOString, {});
    expect(actual).toBe(validISOString);
  });
});
