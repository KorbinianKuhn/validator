const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const INTEGER = require('../../src/types/integer');

describe('INTEGER()', function () {
  it('required but null should fail', helper.mochaAsync(async() => {
    try {
      await INTEGER().validate(null, helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Required but is null.`);
    }
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    for (const value of ['10', null, 10.5]) {
      try {
        await INTEGER().validate(value);
        should.equal(true, false, 'Should throw');
      } catch (err) {
        err.should.equal(`Must be integer but is ${typeof value}.`);
      }
    }
  }));

  it('valid type should verify', helper.mochaAsync(async() => {
    for (const value of [10, -20, 0, 1238412]) {
      const result = await INTEGER().validate(value);
      result.should.equal(value);
    }
  }));

  it('invalid value should fail', helper.mochaAsync(async() => {
    try {
      await INTEGER().min(10).validate(5);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Must be at minimum 10.');
    }

    try {
      await INTEGER().max(10).validate(15);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Must be at maximum 10.');
    }
  }));

  it('valid value should verify', helper.mochaAsync(async() => {
    let value = await INTEGER().min(10).validate(15);
    value.should.equal(15);

    value = await INTEGER().max(20).validate(15);
    value.should.equal(15);
  }));

  it('parsed values should fail', helper.mochaAsync(async() => {
    const integer = INTEGER({
      parseToType: true
    });
    for (const value of ['10.0', true, '-0.9']) {
      try {
        await integer.validate(value);
      } catch (err) {
        err.should.equal(`Must be integer but is ${typeof value}.`);
      }
    }
  }));

  it('parsed values should verify', helper.mochaAsync(async() => {
    const integer = INTEGER({
      parseToType: true
    });

    const values = ['10', '-10', '0', '+20'];
    const parsed = [10, -10, 0, 20];

    for (const index in values) {
      let value = await integer.validate(values[index]);
      value.should.equal(parsed[index]);
    }
  }));

});
