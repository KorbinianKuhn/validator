const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const BOOLEAN = require('../../src/types/boolean');

describe('BOOLEAN()', function () {
  it('required but null should fail', helper.mochaAsync(async() => {
    const boolean = BOOLEAN()
    const result = await boolean.isValid(null, helper.DEFAULT_OPTIONS);
    result.should.be.false();
    boolean.errorMessage.should.equal(`Required but is null.`, 'Wrong error message');
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    for (const value of ['true', null, 1, 0]) {
      const result = await BOOLEAN().isValid(value);
      result.should.be.false();
    }
  }));

  it('valid type should verify', helper.mochaAsync(async() => {
    for (const value of [true, false]) {
      const result = await BOOLEAN().isValid(value);
      result.should.be.ok();
    }
  }));
});