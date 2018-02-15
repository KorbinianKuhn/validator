const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const FUNCTION = require('../../src/types/function');

const testFunction = value => value;
const throwFunction = () => {
  throw new Error('Custom error message.');
};

describe('FUNCTION()', () => {
  it('no function should throw', () => {
    (() => {
      FUNCTION();
    }).should.throw('Missing function.');
  });

  it('invalid function should throw', () => {
    (() => {
      FUNCTION('invalid');
    }).should.throw('Not a function.');
  });

  it('required but null should fail', helper.mochaAsync(async () => {
    const message = await helper.shouldThrow(async () => FUNCTION(testFunction).validate(null, helper.DEFAULT_OPTIONS));
    message.should.equal('Required but is null.');
  }));

  it('null and undefined should verify', helper.mochaAsync(async () => {
    let result = await FUNCTION(testFunction).validate(null);
    should.equal(result, null);

    result = await FUNCTION(testFunction).validate(undefined);
    should.equal(result, undefined);
  }));

  it('function should verify', helper.mochaAsync(async () => {
    let result = await FUNCTION(testFunction).validate('test');
    result.should.equal('test');

    result = await FUNCTION(testFunction).validate('test', helper.DEFAULT_OPTIONS);
    result.should.equal('test');
  }));

  it('function should throw custom error message', helper.mochaAsync(async () => {
    const message = await helper.shouldThrow(async () => FUNCTION(throwFunction).validate('test', helper.DEFAULT_OPTIONS));
    message.should.equal('Custom error message.');
  }));

  it('valid default value should verify', helper.mochaAsync(async () => {
    const result = await FUNCTION(testFunction).default('test').validate();
    result.should.equal('test');
  }));
});
