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
    try {
      await ENUM(['a', 'b', 'c']).validate(null, helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Required but is null.`);
    }
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    for (const value of ['d', null, 1, 0]) {
      try {
        await ENUM(['a', 'b', 'c']).validate(value);
        should.equal(true, false, 'Should throw');
      } catch (err) {
        err.should.equal(`'${value}' is not one of [a,b,c].`);
      }
    }
  }));

  it('valid type should verify', helper.mochaAsync(async() => {
    for (const value of ['a', 'b']) {
      const result = await ENUM(['a', 'b', 'c']).validate(value);
      result.should.equal(value);
    }
  }));
});
