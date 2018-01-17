const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const ENUM = require('../../src/types/enum');

describe('ENUM()', () => {
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
    const message = await helper.shouldThrow(async() => ENUM(['a', 'b', 'c']).validate(null, helper.DEFAULT_OPTIONS));
    message.should.equal('Required but is null.');
  }));

  it('null and undefined should verify', helper.mochaAsync(async() => {
    let result = await ENUM(['a', 'b', 'c']).validate(null);
    should.equal(result, null);

    result = await ENUM(['a', 'b', 'c']).validate(undefined);
    should.equal(result, undefined);
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    for (const value of ['d', 1, 0]) {
      const message = await helper.shouldThrow(async() => ENUM(['a', 'b', 'c']).validate(value));
      message.should.equal(`'${value}' is not one of [a,b,c].`);
    }
  }));

  it('valid type should verify', helper.mochaAsync(async() => {
    for (const value of ['a', 'b']) {
      const result = await ENUM(['a', 'b', 'c']).validate(value);
      result.should.equal(value);
    }
  }));

  it('valid default value should verify', helper.mochaAsync(async() => {
    let result = await ENUM(['a', 'b', 'c']).default('a').validate();
    result.should.deepEqual('a');

    result = await ENUM(['a', 'b', 'c']).default('a').validate('b');
    result.should.deepEqual('b');
  }));

  it('deprecated function defaultValue should verify', async() => {
    let result = await ENUM(['a', 'b', 'c']).defaultValue('a').validate();
    result.should.deepEqual('a');
  });
});
