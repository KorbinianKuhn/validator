const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const BOOLEAN = require('../../src/types/boolean');

describe('BOOLEAN()', function () {
  it('required but null should fail', helper.mochaAsync(async() => {
    try {
      await BOOLEAN().validate(null, helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Required but is null.`);
    }
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    for (const value of ['true', null, 1, 0]) {
      try {
        await BOOLEAN().validate(value);
        should.equal(true, false, 'Should throw');
      } catch (err) {
        err.should.equal(`Must be boolean but is ${typeof value}.`);
      }
    }
  }));

  it('valid type should verify', helper.mochaAsync(async() => {
    for (const value of [true, false]) {
      const result = await BOOLEAN().validate(value);
      result.should.equal(value);
    }
  }));

  it('parsed strings should fail', helper.mochaAsync(async() => {
    for (const value of ['1', '2']) {
      try {
        await BOOLEAN().validate(value, {
          parseToType: true
        });
        should.equal(true, false, 'Should throw');
      } catch (err) {
        err.should.equal(`Must be boolean but is ${typeof value}.`);
      }
    }
  }));

  it('parsed strings should verify', helper.mochaAsync(async() => {
    let result = await BOOLEAN().validate('true', {
      parseToType: true
    });
    result.should.equal(true);

    result = await BOOLEAN().validate('false', {
      parseToType: true
    });
    result.should.equal(false);
  }));
});
