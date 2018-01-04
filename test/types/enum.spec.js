const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const ENUM = require('../../src/types/enum');

describe('ENUM()', function () {
  it('no values should throw', () => {
    (() => {
      ENUM()
    }).should.throw('Missing values for enum.');
  });

  it('invalid values should throw', () => {
    (() => {
      ENUM('invalid')
    }).should.throw('Values must be an array.');
  });

  it('required but null should fail', helper.mochaAsync(async() => {
    const e = ENUM(['a', 'b', 'c'])
    const result = await e.isValid(null, helper.DEFAULT_OPTIONS);
    result.should.be.false();
    e.errorMessage.should.equal(`Required but is null.`, 'Wrong error message');
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    const e = ENUM(['a', 'b', 'c']);
    const result = await e.isValid('d');
    result.should.be.false();
    e.errorMessage.should.equal(`'d' is not one of [a,b,c].`);
  }));

  it('valid type should verify', helper.mochaAsync(async() => {
    const e = ENUM(['a', 'b', 'c']);
    const result = await e.isValid('b');
    result.should.be.ok();
  }));
});