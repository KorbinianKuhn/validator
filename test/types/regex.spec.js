const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const REGEX = require('../../src/types/regex');

describe('REGEX()', function () {
  it('no regex should throw', () => {
    (function () {
      REGEX()
    }).should.throw('Invalid regular expression');
  });

  it('required but null should fail', helper.mochaAsync(async() => {
    try {
      await REGEX(/[A-Z]/).validate(null, helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Required but is null.`);
    }
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    for (const value of [null, 1, 0]) {
      try {
        await REGEX(/[A-Z]/).validate(value);
        should.equal(true, false, 'Should throw');
      } catch (err) {
        err.should.equal(`Must be string but is ${typeof value}.`);
      }
    }
  }));

  it('valid value should verify', helper.mochaAsync(async() => {
    const value = await REGEX(/[A-Z]/).validate('ABC');
    value.should.equal('ABC');
  }));

  it('invalid value should fail', helper.mochaAsync(async() => {
    try {
      await REGEX(/[A-Z]/).validate('abc');
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Value does not match regular expression.');
    }
  }));

  it('invalid length should fail', helper.mochaAsync(async() => {
    try {
      await REGEX(/[A-Z]/).minLength(5).validate('ABC', helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Must have at least 5 characters.`);
    }

    try {
      await REGEX(/[A-Z]/).maxLength(3).validate('ABCD', helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Must have at most 3 characters.');
    }

    try {
      await REGEX(/[A-Z]/).exactLength(3).validate('ABCD', helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Must have exactly 3 characters.');
    }
  }));

  it('valid length should verify', helper.mochaAsync(async() => {
    let value = await REGEX(/[A-Z]/).minLength(3).validate('ABC', helper.DEFAULT_OPTIONS);
    value.should.equal('ABC');

    value = await REGEX(/[A-Z]/).maxLength(3).validate('ABC', helper.DEFAULT_OPTIONS);
    value.should.equal('ABC');

    value = await REGEX(/[A-Z]/).exactLength(3).validate('ABC', helper.DEFAULT_OPTIONS);
    value.should.equal('ABC');
  }));

});
