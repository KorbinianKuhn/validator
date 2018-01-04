const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const NUMBER = require('../../src/types/number');

describe('NUMBER()', function () {
  it('required but null should fail', helper.mochaAsync(async() => {
    try {
      await NUMBER().validate(null, helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Required but is null.`);
    }
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    for (const value of ['10', null]) {
      try {
        await NUMBER().validate(value);
        should.equal(true, false, 'Should throw');
      } catch (err) {
        err.should.equal(`Must be number but is ${typeof value}.`);
      }
    }
  }));

  it('invalid value should fail', helper.mochaAsync(async() => {
    try {
      await NUMBER().min(10).validate(5);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Must be at minimum 10.');
    }

    try {
      await NUMBER().max(10).validate(15);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Must be at maximum 10.');
    }
  }));

  it('valid value should verify', helper.mochaAsync(async() => {
    let value = await NUMBER().min(10).validate(15);
    value.should.equal(15);

    value = await NUMBER().max(20).validate(15);
    value.should.equal(15);
  }));

  it('parsed values should fail', helper.mochaAsync(async() => {
    const number = NUMBER({
      parseToType: true
    });
    for (const value of ['test', true]) {
      try {
        await number.validate(value);
      } catch (err) {
        err.should.equal(`Must be number but is ${typeof value}.`);
      }
    }
  }));

  it('parsed values should verify', helper.mochaAsync(async() => {
    const integer = NUMBER({
      parseToType: true
    });

    const values = ['10', '-10', '0', '+20', '3.21312', '48120.2912'];
    const parsed = [10, -10, 0, 20, 3.21312, 48120.2912];

    for (const index in values) {
      let value = await integer.validate(values[index]);
      value.should.equal(parsed[index]);
    }
  }));
});
