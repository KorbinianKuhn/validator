const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const INTEGER = require('../../src/types/integer');

describe('INTEGER()', () => {
  it('required but null should fail', helper.mochaAsync(async () => {
    const message = await helper.shouldThrow(async () => INTEGER().validate(null, helper.DEFAULT_OPTIONS));
    message.should.equal(`Required but is null.`);
  }));

  it('null and undefined should verify', helper.mochaAsync(async () => {
    let result = await INTEGER().validate(null);
    should.equal(result, null);

    result = await INTEGER().validate(undefined);
    should.equal(result, undefined);
  }));

  it('invalid type should fail', helper.mochaAsync(async () => {
    for (const value of ['10', 10.5]) {
      const message = await helper.shouldThrow(async () => INTEGER().validate(value));
      message.should.equal(`Must be integer but is ${typeof value}.`);
    }
  }));

  it('valid type should verify', helper.mochaAsync(async () => {
    for (const value of [10, -20, 0, 1238412]) {
      const result = await INTEGER().validate(value);
      result.should.equal(value);
    }
  }));

  it('invalid value should fail', helper.mochaAsync(async () => {
    let message = await helper.shouldThrow(async () => INTEGER().min(10).validate(5));
    message.should.equal('Must be at minimum 10.');

    message = await helper.shouldThrow(async () => INTEGER().max(10).validate(15));
    message.should.equal('Must be at maximum 10.');
  }));

  it('valid value should verify', helper.mochaAsync(async () => {
    let value = await INTEGER().min(10).validate(15);
    value.should.equal(15);

    value = await INTEGER().max(20).validate(15);
    value.should.equal(15);
  }));

  it('parsed values should fail', helper.mochaAsync(async () => {
    const integer = INTEGER({
      parseToType: true
    });
    for (const value of ['10.0', true, '-0.9']) {
      const message = await helper.shouldThrow(async () => integer.validate(value));
      message.should.equal(`Must be integer but is ${typeof value}.`);
    }
  }));

  it('parsed values should verify', helper.mochaAsync(async () => {
    const integer = INTEGER({
      parseToType: true
    });

    const values = ['10', '-10', '0', '+20'];
    const parsed = [10, -10, 0, 20];

    for (const index in values) {
      const value = await integer.validate(values[index]);
      value.should.equal(parsed[index]);
    }
  }));

  it('invalid default value should throw', helper.mochaAsync(async () => {
    const result = await helper.shouldThrow(async () => INTEGER().default('invalid'));
    result.message.should.equal('Must be integer.');
  }));

  it('valid default value should verify', helper.mochaAsync(async () => {
    let result = await INTEGER().default(1).validate();
    result.should.equal(1);

    result = await INTEGER().default(1).validate(2);
    result.should.equal(2);
  }));

  it('test less function', helper.mochaAsync(async () => {
    let error;
    await INTEGER().less(1).validate(2).catch((err) => {
      error = err;
    });
    error.should.equal('Must be less than 1.');

    const result = await INTEGER().less(1).validate(0);
    result.should.equal(0);
  }));

  it('test greater function', helper.mochaAsync(async () => {
    let error;
    await INTEGER().greater(2).validate(1).catch((err) => {
      error = err;
    });
    error.should.equal('Must be greater than 2.');

    const result = await INTEGER().greater(2).validate(3);
    result.should.equal(3);
  }));

  it('test positive function', helper.mochaAsync(async () => {
    let error;
    await INTEGER().positive().validate(0).catch((err) => {
      error = err;
    });
    error.should.equal('Must be a positive integer.');

    error = undefined;
    await INTEGER().positive().validate(-1).catch((err) => {
      error = err;
    });
    error.should.equal('Must be a positive integer.');

    const result = await INTEGER().positive().validate(3);
    result.should.equal(3);
  }));

  it('test negative function', helper.mochaAsync(async () => {
    let error;
    await INTEGER().negative().validate(0).catch((err) => {
      error = err;
    });
    error.should.equal('Must be a negative integer.');

    error = undefined;
    await INTEGER().negative().validate(1).catch((err) => {
      error = err;
    });
    error.should.equal('Must be a negative integer.');

    const result = await INTEGER().negative().validate(-3);
    result.should.equal(-3);
  }));

  it.only('toObject() should verify', async () => {
    const schema = INTEGER().min(2).max(10).name('My Integer').description('A very nice integer.').example(5);
    console.log(schema.toObject());
  });
});
