const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const FUNCTION = require('../../src/types/function');

const testFunction = () => {
  return true;
}
const throwFunction = () => {
  throw new Error('Custom error message.');
}

describe('FUNCTION()', function () {
  it('no function should throw', () => {
    (() => {
      FUNCTION()
    }).should.throw('Missing function.');
  });

  it('invalid function should throw', () => {
    (() => {
      FUNCTION('invalid')
    }).should.throw('Not a function.');
  });

  it('required but null should fail', helper.mochaAsync(async() => {
    const func = FUNCTION(testFunction)
    const result = await func.isValid(null, helper.DEFAULT_OPTIONS);
    result.should.be.false();
    func.errorMessage.should.equal(`Required but is null.`, 'Wrong error message');
  }));

  it('function should verify', helper.mochaAsync(async() => {
    const func = FUNCTION(testFunction)
    const result = await func.isValid('test', helper.DEFAULT_OPTIONS);
    result.should.be.ok();
  }));

  it('function should throw custom error message', helper.mochaAsync(async() => {
    const func = FUNCTION(throwFunction)
    const result = await func.isValid('test', helper.DEFAULT_OPTIONS);
    result.should.be.false();
    func.errorMessage.should.equal('Custom error message.', 'Wrong error message')
  }));
});