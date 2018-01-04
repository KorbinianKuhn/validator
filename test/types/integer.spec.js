const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const INTEGER = require('../../src/types/integer');

describe('INTEGER()', function () {
  it('required but null should fail', helper.mochaAsync(async() => {
    const integer = INTEGER()
    const result = await integer.isValid(null, helper.DEFAULT_OPTIONS);
    result.should.be.false();
    integer.errorMessage.should.equal(`Required but is null.`, 'Wrong error message');
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    for (const value of ['10', null, 10.5]) {
      const integer = INTEGER()
      const result = await integer.isValid(value);
      result.should.be.false();
      integer.errorMessage.should.equal(`Must be integer but is ${typeof value}.`, 'Wrong error message');
    }
  }));

  it('valid type should verify', helper.mochaAsync(async() => {
    for (const value of [10, -20, 0, 1238412]) {
      const result = await INTEGER().isValid(value);
      result.should.be.ok();
    }
  }));

  it('invalid length should fail', helper.mochaAsync(async() => {
    let integer = INTEGER().min(10);
    result = await integer.isValid(5);
    result.should.be.false();
    integer.errorMessage.should.equal('Must be at minimum 10.', 'Wrong error message')

    integer = INTEGER().max(20);
    result = await integer.isValid(25);
    result.should.be.false();
    integer.errorMessage.should.equal('Must be at maximum 20.', 'Wrong error message')
  }));

  it('valid length should verify', helper.mochaAsync(async() => {
    let result = await INTEGER().min(10).isValid(15);
    result.should.be.ok();

    result = await INTEGER().max(20).isValid(15);
    result.should.be.ok();
  }));
});