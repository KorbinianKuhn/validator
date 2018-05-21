const {
  validateString,
  validateSync,
  validate
} = require('./../../../../src/validator/default/validation/string');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');
const should = require('should');

describe('validator/default/validation/string', () => {
  const message = Message('en');

  it('validateString() should return given value', () => {
    const actual = validateString('test', { message, required: true });
    actual.should.equal('test');
  });

  it('validateString() should return defaultValue', () => {
    const actual = validateString(undefined, {
      message,
      required: true,
      defaultValue: 'test'
    });
    actual.should.equal('test');
  });

  it('validateString() with null should verify', () => {
    const actual = validateString(null, {
      allowed: [null]
    });
    should.equal(actual, null);
  });

  it('validateString() with null should throw', () => {
    helper.shouldThrow(
      () =>
        validateString(null, {
          message,
          required: true,
          allowed: []
        }),
      'Required but is null.'
    );
  });

  it('validateString() should throw', () => {
    helper.shouldThrow(
      () => validateString(true, { message, required: true }),
      'Must be type string but is boolean.'
    );
  });

  it('validateString() should return trimmed value', () => {
    const actual = validateString(' test  ', {
      trim: true
    });
    actual.should.equal('test');
  });

  it('validateString() empty string should throw', () => {
    helper.shouldThrow(
      () => validateString('', { message, empty: false }),
      'String is empty.'
    );
  });

  it('validateString() empty string should verify', () => {
    const actual = validateString('', {});
    actual.should.equal('');
  });

  it('validateString() min length should throw', () => {
    helper.shouldThrow(
      () => validateString('te', { message, min: 3 }),
      'Must have at least 3 characters.'
    );
  });

  it('validateString() min length should verify', () => {
    const actual = validateString('test', { min: 3 });
    actual.should.equal('test');
  });

  it('validateString() max length should throw', () => {
    helper.shouldThrow(
      () => validateString('test', { message, max: 3 }),
      'Must have at most 3 characters.'
    );
  });

  it('validateString() max length should verify', () => {
    const actual = validateString('te', { max: 3 });
    actual.should.equal('te');
  });

  it('validateString() length should throw', () => {
    helper.shouldThrow(
      () => validateString('te', { message, length: 3 }),
      'Must have exactly 3 characters.'
    );
  });

  it('validateString() length length should verify', () => {
    const actual = validateString('test', { length: 4 });
    actual.should.equal('test');
  });

  it('validateString() with regex should verify', () => {
    const actual = validateString('TEST', {
      regex: { pattern: /[A-Z]/, locales: {} }
    });
    actual.should.equal('TEST');
  });

  it('validateString() with regex should throw', () => {
    helper.shouldThrow(
      () =>
        validateString('test', {
          message,
          regex: { pattern: /[A-Z]/, locales: {} }
        }),
      'Value does not match regular expression.'
    );
  });

  it('validateString() with regex should return custom error message', () => {
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

  it('validateString() with regex should return default error message', () => {
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

  it('validateSync() should return given value', () => {
    const actual = validateSync('test', {});
    actual.should.equal('test');
  });

  it('validate() should return given value', async () => {
    const actual = await validate('test', {});
    actual.should.equal('test');
  });
});
