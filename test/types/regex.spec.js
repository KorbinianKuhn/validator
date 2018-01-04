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
    const regex = REGEX(/[A-Z]/);
    const result = await regex.isValid(null, helper.DEFAULT_OPTIONS);
    result.should.be.false();
    regex.errorMessage.should.equal('Required but is null.', 'Wrong error message');
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    const regex = REGEX(/[A-Z]/);
    for (const value of [null, 1234, true]) {
      const result = await regex.isValid(value);
      result.should.be.false();
      regex.errorMessage.should.equal(`Must be string but is ${typeof value}.`, 'Wrong error message')
    }
  }));

  it('valid value should verify', helper.mochaAsync(async() => {
    const result = await REGEX(/[A-Z]/).isValid('ABC');
    result.should.be.ok();
  }));

  it('invalid value should fail', helper.mochaAsync(async() => {
    const regex = REGEX(/[A-Z]/)
    const result = await regex.isValid('abc');
    result.should.be.false();
    regex.errorMessage.should.equal('Value does not match regular expression.', 'Wrong error message');
  }));

  it('invalid length should fail', helper.mochaAsync(async() => {
    let regex = REGEX(/[A-Z]/).minLength(5);
    let result = await regex.isValid('ABC');
    result.should.be.false();
    regex.errorMessage.should.equal('Must have at least 5 characters.', 'Wrong error message');

    regex = REGEX(/[A-Z]/).maxLength(3);
    result = await regex.isValid('ABCD');
    result.should.be.false();
    regex.errorMessage.should.equal('Must have at most 3 characters.', 'Wrong error message');

    regex = REGEX(/[A-Z]/).exactLength(4);
    result = await regex.isValid('ABC');
    result.should.be.false();
    regex.errorMessage.should.equal('Must have exactly 4 characters.', 'Wrong error message');
  }));

  it('valid length should verify', helper.mochaAsync(async() => {
    let regex = REGEX(/[A-Z]/).minLength(3);
    let result = await regex.isValid('ABC');
    result.should.be.ok();

    regex = REGEX(/[A-Z]/).maxLength(3);
    result = await regex.isValid('ABC');
    result.should.be.ok();

    regex = REGEX(/[A-Z]/).exactLength(4);
    result = await regex.isValid('ABCD');
    result.should.be.ok();
  }));
});