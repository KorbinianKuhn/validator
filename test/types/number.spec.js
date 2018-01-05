const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const NUMBER = require('../../src/types/number');

describe('NUMBER()', function () {
  it('required but null should fail', helper.mochaAsync(async() => {
    const message = await helper.shouldThrow(async() => NUMBER().validate(null, helper.DEFAULT_OPTIONS));
    message.should.equal(`Required but is null.`);
  }));

  it('null and undefined should verify', helper.mochaAsync(async() => {
    let result = await NUMBER().validate(null);
    should.equal(result, null);

    result = await NUMBER().validate(undefined);
    should.equal(result, undefined);
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    for (const value of ['10', 'test']) {
      const message = await helper.shouldThrow(async() => NUMBER().validate(value));
      message.should.equal(`Must be number but is ${typeof value}.`);
    }
  }));

  it('invalid value should fail', helper.mochaAsync(async() => {
    let message = await helper.shouldThrow(async() => NUMBER().min(10).validate(5));
    message.should.equal('Must be at minimum 10.');

    message = await helper.shouldThrow(async() => NUMBER().max(10).validate(15));
    message.should.equal('Must be at maximum 10.');
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
      const message = await helper.shouldThrow(async() => number.validate(value));
      message.should.equal(`Must be number but is ${typeof value}.`);
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

  it('invalid default value should throw', helper.mochaAsync(async() => {
    const result = await helper.shouldThrow(async() => NUMBER().defaultValue('invalid'));
    result.message.should.equal('Must be number.');
  }));

  it('valid default value should verify', helper.mochaAsync(async() => {
    let result = await NUMBER().defaultValue(1.5).validate();
    result.should.equal(1.5);

    result = await NUMBER().defaultValue(1.3).validate(2);
    result.should.equal(2);
  }));
});
