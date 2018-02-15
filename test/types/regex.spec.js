const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const REGEX = require('../../src/types/regex');

describe('REGEX()', () => {
  it('no regex should throw', () => {
    (function () {
      REGEX();
    }).should.throw('Invalid regular expression');
  });

  it('required but null should fail', helper.mochaAsync(async () => {
    try {
      await REGEX(/[A-Z]/).validate(null, helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Required but is null.`);
    }
  }));

  it('null and undefined should verify', helper.mochaAsync(async () => {
    let result = await REGEX(/[A-Z]/).validate(null);
    should.equal(result, null);

    result = await REGEX(/[A-Z]/).validate(undefined);
    should.equal(result, undefined);
  }));

  it('invalid type should fail', helper.mochaAsync(async () => {
    for (const value of [1, true]) {
      try {
        await REGEX(/[A-Z]/).validate(value);
        should.equal(true, false, 'Should throw');
      } catch (err) {
        err.should.equal(`Must be string but is ${typeof value}.`);
      }
    }
  }));

  it('valid value should verify', helper.mochaAsync(async () => {
    const value = await REGEX(/[A-Z]/).validate('ABC');
    value.should.equal('ABC');
  }));

  it('regex object should verify', helper.mochaAsync(async () => {
    const value = await REGEX(new RegExp(/[A-Z]/)).validate('ABC');
    value.should.equal('ABC');
  }));

  it('invalid value should fail', helper.mochaAsync(async () => {
    try {
      await REGEX(/[A-Z]/).validate('abc');
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Value does not match regular expression.');
    }
  }));

  it('invalid length should fail', helper.mochaAsync(async () => {
    try {
      await REGEX(/[A-Z]/).min(5).validate('ABC', helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Must have at least 5 characters.`);
    }

    try {
      await REGEX(/[A-Z]/).max(3).validate('ABCD', helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Must have at most 3 characters.');
    }

    try {
      await REGEX(/[A-Z]/).length(3).validate('ABCD', helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Must have exactly 3 characters.');
    }
  }));

  it('valid length should verify', helper.mochaAsync(async () => {
    let value = await REGEX(/[A-Z]/).min(3).validate('ABC', helper.DEFAULT_OPTIONS);
    value.should.equal('ABC');

    value = await REGEX(/[A-Z]/).max(3).validate('ABC', helper.DEFAULT_OPTIONS);
    value.should.equal('ABC');

    value = await REGEX(/[A-Z]/).length(3).validate('ABC', helper.DEFAULT_OPTIONS);
    value.should.equal('ABC');
  }));

  it('invalid default value should throw', helper.mochaAsync(async () => {
    const result = await helper.shouldThrow(async () => REGEX(/[A-Z]/).default(1234));
    result.message.should.equal('Must be string.');
  }));

  it('valid default value should verify', helper.mochaAsync(async () => {
    let result = await REGEX(/[A-Z]/).default('ABC').validate();
    result.should.equal('ABC');

    result = await REGEX(/[A-Z]/).default('ABC').validate('DEF');
    result.should.equal('DEF');
  }));

  it('empty should verify', helper.mochaAsync(async () => {
    let result = await helper.shouldThrow(async () => REGEX(/[A-Z]/).empty(false).validate(''));
    result.should.equal('Value does not match regular expression.');

    result = await REGEX(/[A-Z]/).empty(true).validate('');
    result.should.equal('');
  }));

  it('should return custom message', helper.mochaAsync(async () => {
    const result = await helper.shouldThrow(async () => REGEX(/[A-Z]/).empty(false).message('Must have only uppercase letters.').validate(''));
    result.should.equal('Must have only uppercase letters.');
  }));

  it.only('toObject() should verify', async () => {
    const schema = REGEX(/[A-Z]/).min(2).max(20).name('My Regex').description('A very nice regex.').example('ABC');
    console.log(schema.toObject());
  });
});
