const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const NUMBER = require('../../src/types/number');

describe('NUMBER()', function () {
  it('required but null should fail', helper.mochaAsync(async() => {
    const number = NUMBER()
    const result = await number.isValid(null, helper.DEFAULT_OPTIONS);
    result.should.be.false();
    number.errorMessage.should.equal(`Required but is null.`, 'Wrong error message');
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    for (const value of ['10', null]) {
      const number = NUMBER()
      const result = await number.isValid(value);
      result.should.be.false();
      number.errorMessage.should.equal(`Must be number but is ${typeof value}.`, 'Wrong error message');
    }
  }));

  it('valid type should verify', helper.mochaAsync(async() => {
    for (const value of [10, -20, 0, 1238412, 5.0, -2.3]) {
      const result = await NUMBER().isValid(value);
      result.should.be.ok();
    }
  }));

  it('invalid length should fail', helper.mochaAsync(async() => {
    let number = NUMBER().min(10);
    result = await number.isValid(5);
    result.should.be.false();
    number.errorMessage.should.equal('Must be at minimum 10.', 'Wrong error message')

    number = NUMBER().max(20);
    result = await number.isValid(25);
    result.should.be.false();
    number.errorMessage.should.equal('Must be at maximum 20.', 'Wrong error message')
  }));

  it('valid length should verify', helper.mochaAsync(async() => {
    let result = await NUMBER().min(10).isValid(15);
    result.should.be.ok();

    result = await NUMBER().max(20).isValid(15);
    result.should.be.ok();
  }));
});