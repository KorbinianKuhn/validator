const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const FUNCTION = require('../../src/types/function');

const testFunction = (value) => {
  return value;
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
    try {
      await FUNCTION(testFunction).validate(null, helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Required but is null.`);
    }
  }));

  it('function should verify', helper.mochaAsync(async() => {
    let result = await FUNCTION(testFunction).validate('test');
    result.should.equal('test');

    result = await FUNCTION(testFunction).validate('test', helper.DEFAULT_OPTIONS);
    result.should.equal('test');
  }));

  it('function should throw custom error message', helper.mochaAsync(async() => {
    try {
      await FUNCTION(throwFunction).validate('test', helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Custom error message.')
    }
  }));
});
