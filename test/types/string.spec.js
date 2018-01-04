const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const STRING = require('../../src/types/string');

describe('STRING()', function () {
  it('required but null should fail', helper.mochaAsync(async() => {
    try {
      await STRING().validate(null, helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Required but is null.`);
    }
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    for (const value of [null, 0, [], {}]) {
      try {
        await STRING().validate(value);
        should.equal(true, false, 'Should throw');
      } catch (err) {
        err.should.equal(`Must be string but is ${typeof value}.`);
      }
    }
  }));

  it('valid type should verify', helper.mochaAsync(async() => {
    for (const value of ['1234', 'test']) {
      const result = await STRING().validate(value);
      result.should.equal(value);
    }
  }));

  it('invalid length should fail', helper.mochaAsync(async() => {
    try {
      await STRING().minLength(5).validate('test', helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Must have at least 5 characters.`);
    }

    try {
      await STRING().maxLength(3).validate('test', helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Must have at most 3 characters.');
    }

    try {
      await STRING().exactLength(3).validate('test', helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Must have exactly 3 characters.');
    }
  }));

  it('valid length should verify', helper.mochaAsync(async() => {
    let value = await STRING().minLength(3).validate('test', helper.DEFAULT_OPTIONS);
    value.should.equal('test');

    value = await STRING().maxLength(5).validate('test', helper.DEFAULT_OPTIONS);
    value.should.equal('test');

    value = await STRING().exactLength(4).validate('test', helper.DEFAULT_OPTIONS);
    value.should.equal('test');
  }));


  it('empty string should fail', helper.mochaAsync(async() => {
    try {
      await STRING().validate('', helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('String is empty.');
    }
  }));

  it('empty string allowed should verify', helper.mochaAsync(async() => {
    const string = STRING();
    const result = await string.validate('', {
      noEmptyStrings: false
    });
    result.should.equal('');
  }));
});
