const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const BOOLEAN = require('../../src/types/boolean');

describe('BOOLEAN()', function () {
  it('required but null should fail', helper.mochaAsync(async() => {
    const result = await helper.shouldThrow(async() => BOOLEAN().validate(null, helper.DEFAULT_OPTIONS));
    result.should.equal('Required but is null.');
  }));

  it('null and undefined should verify', helper.mochaAsync(async() => {
    let result = await BOOLEAN().validate(null);
    should.equal(result, null);

    result = await BOOLEAN().validate(undefined);
    should.equal(result, undefined);
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    for (const value of ['true', 1, 0]) {
      const result = await helper.shouldThrow(async() => BOOLEAN().validate(value));
      result.should.equal(`Must be boolean but is ${typeof value}.`);
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
      const result = await helper.shouldThrow(async() => BOOLEAN().validate(value, {
        parseToType: true
      }));
      result.should.equal(`Must be boolean but is ${typeof value}.`);
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

  it('invalid default value should throw', helper.mochaAsync(async() => {
    const result = await helper.shouldThrow(async() => BOOLEAN().default('invalid'));
    result.message.should.equal('Must be boolean.');
  }));

  it('valid default value should verify', helper.mochaAsync(async() => {
    let result = await BOOLEAN().default(true).validate();
    result.should.deepEqual(true);

    result = await BOOLEAN().default(true).validate(false);
    result.should.deepEqual(false);
  }));
});
