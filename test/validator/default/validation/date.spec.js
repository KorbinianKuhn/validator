const {
  validateDate,
  validateSync,
  validate
} = require('./../../../../src/validator/default/validation/date');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');
const moment = require('moment');
const should = require('should');

describe('validator/default/validation/date', () => {
  const message = Message('en');
  const validISOString = '2018-01-01T00:00:00.000Z';

  it('validateDate() should return given value', () => {
    const actual = validateDate(validISOString, { message, required: true });
    actual.should.equal(validISOString);
  });

  it('validateDate() should return defaultValue', () => {
    const actual = validateDate(undefined, {
      message,
      required: true,
      defaultValue: validISOString
    });
    actual.should.equal(validISOString);
  });

  it('validateDate() with undefined should verify', () => {
    const actual = validateDate(undefined, {});
    should.equal(actual, undefined);
  });

  it('validateDate() with null should verify', () => {
    const actual = validateDate(null, {
      allowed: [null]
    });
    should.equal(actual, null);
  });

  it('validateDate() with undefined should throw', () => {
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

  it('validateDate() should throw', () => {
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

  it('validateDate() should parse to date', () => {
    let actual = validateDate(validISOString, {
      message,
      required: true,
      parse: true
    });
    moment(actual)
      .toISOString()
      .should.equal(validISOString);
  });

  it.only('validateDate() should parse to utc date', () => {
    let actual = validateDate(validISOString, {
      message,
      required: true,
      parse: true,
      utc: true
    });
    moment
      .utc(actual)
      .toISOString()
      .should.equal(validISOString);
  });

  it('validateDate() min date should verify', () => {
    const actual = validateDate(validISOString, {
      message,
      min: '2017-01-01'
    });
    actual.should.equal(validISOString);
  });

  it('validateDate() min date should fail', () => {
    helper.shouldThrow(
      () =>
        validateDate(validISOString, {
          message,
          min: '2019-01-01'
        }),
      'Must be at minimum 2019-01-01.'
    );
  });

  it('validateDate() max date should verify', () => {
    const actual = validateDate(validISOString, {
      message,
      max: '2019-01-01'
    });
    actual.should.equal(validISOString);
  });

  it('validateDate() max date should fail', () => {
    helper.shouldThrow(
      () =>
        validateDate(validISOString, {
          message,
          max: '2017-01-01'
        }),
      'Must be at maximum 2017-01-01.'
    );
  });

  it('validateSync() should return given value', () => {
    const actual = validateSync(validISOString, {});
    actual.should.equal(validISOString);
  });

  it('validate() should return given value', async () => {
    const actual = await validate(validISOString, {});
    actual.should.equal(validISOString);
  });
});
