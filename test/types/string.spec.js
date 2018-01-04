const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const STRING = require('../../src/types/string');

describe('STRING()', function () {
  it('required but null should fail', helper.mochaAsync(async() => {
    const string = STRING();
    const result = await string.isValid(null, helper.DEFAULT_OPTIONS);
    result.should.be.false();
    string.errorMessage.should.equal('Required but is null.', 'Wrong error message');
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    const string = STRING();
    const result = await string.isValid(1234, helper.DEFAULT_OPTIONS);
    result.should.be.false();
    string.errorMessage.should.equal('Must be string but is number.', 'Wrong error message');
  }));

  it('valid type should verify', helper.mochaAsync(async() => {
    for (const value of ['1234', 'test']) {
      const result = await STRING().isValid(value, helper.DEFAULT_OPTIONS);
      result.should.be.ok();
    }
  }));

  it('invalid length should fail', helper.mochaAsync(async() => {
    let string = STRING().minLength(5);
    let result = await string.isValid('test', helper.DEFAULT_OPTIONS);
    result.should.be.false();
    string.errorMessage.should.equal('Must have at least 5 characters.', 'Wrong error message');

    string = STRING().maxLength(3);
    result = await string.isValid('test', helper.DEFAULT_OPTIONS);
    result.should.be.false();
    string.errorMessage.should.equal('Must have at most 3 characters.', 'Wrong error message');

    string = STRING().exactLength(3);
    result = await string.isValid('test', helper.DEFAULT_OPTIONS);
    result.should.be.false();
    string.errorMessage.should.equal('Must have exactly 3 characters.', 'Wrong error message');
  }));

  it('valid length should verify', helper.mochaAsync(async() => {
    let string = STRING().minLength(3);
    let result = string.isValid('test', helper.DEFAULT_OPTIONS);
    result.should.be.ok();

    string = STRING().maxLength(4);
    result = string.isValid('test', helper.DEFAULT_OPTIONS);
    result.should.be.ok();

    string = STRING().exactLength(4);
    result = string.isValid('test', helper.DEFAULT_OPTIONS);
    result.should.be.ok();
  }));

  it('empty string should fail', helper.mochaAsync(async() => {
    const string = STRING();
    const result = await string.isValid('', helper.DEFAULT_OPTIONS);
    result.should.be.false();
    string.errorMessage.should.equal('String is empty.', 'Wrong error message');
  }));

  it('empty string allowed should verify', helper.mochaAsync(async() => {
    const string = STRING();
    const result = await string.isValid('', {
      noEmptyStrings: false
    });
    result.should.be.ok();
  }));
});