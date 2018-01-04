const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const ARRAY = require('../../src/types/array');
const INTEGER = require('../../src/types/integer');

describe('ARRAY()', function () {
  it('required but null should fail', helper.mochaAsync(async() => {
    const array = ARRAY();
    const result = await array.isValid(null, helper.DEFAULT_OPTIONS);
    result.should.be.false();
    array.errorMessage.should.equal(`Required but is null.`, 'Wrong error message');
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    const array = ARRAY();
    const result = await array.isValid(1234, helper.DEFAULT_OPTIONS);
    result.should.be.false();
    array.errorMessage.should.equal('Must be array but is number.', 'Wrong error message');
  }));

  it('valid type should verify', helper.mochaAsync(async() => {
    const array = ARRAY();
    let result = array.isValid([], helper.DEFAULT_OPTIONS);
    result.should.be.ok();

    result = array.isValid(['test'], helper.DEFAULT_OPTIONS).should.be.ok();
    result.should.be.ok();
  }));

  it('invalid length should fail', helper.mochaAsync(async() => {
    let array = ARRAY().minLength(5);
    let result = await array.isValid(['test'], helper.DEFAULT_OPTIONS);
    result.should.be.false();
    array.errorMessage.should.equal('Must have at least 5 items.', 'Wrong error message');

    array = ARRAY().maxLength(5);
    result = await array.isValid([1, 2, 3, 4, 5, 6], helper.DEFAULT_OPTIONS);
    result.should.be.false();
    array.errorMessage.should.equal('Must have at most 5 items.', 'Wrong error message');

    array = ARRAY().exactLength(3);
    result = await array.isValid(['test'], helper.DEFAULT_OPTIONS);
    result.should.be.false();
    array.errorMessage.should.equal('Must have exactly 3 items.', 'Wrong error message');
  }));

  it('valid length should verify', helper.mochaAsync(async() => {
    let array = ARRAY().minLength(1);
    let result = await array.isValid(['test'], helper.DEFAULT_OPTIONS);
    result.should.be.ok();

    array = ARRAY().maxLength(1);
    result = await array.isValid(['test'], helper.DEFAULT_OPTIONS);
    result.should.be.ok();

    array = ARRAY().exactLength(1);
    result = await array.isValid(['test'], helper.DEFAULT_OPTIONS);
    result.should.be.ok();
  }));

  it('array with invalid types should fail', helper.mochaAsync(async() => {
    const array = ARRAY(INTEGER());
    const result = await array.isValid(['test', '123'], helper.DEFAULT_OPTIONS);
    result.should.be.false();
  }));

  it('array with valid types should verify', helper.mochaAsync(async() => {
    const array = ARRAY(INTEGER());
    const result = await array.isValid([1, 2, 3, 4, 5], helper.DEFAULT_OPTIONS);
    result.should.be.ok();
  }));

  it('empty array should fail', helper.mochaAsync(async() => {
    const array = ARRAY();
    const result = await array.isValid([], helper.DEFAULT_OPTIONS);
    result.should.be.false();
    array.errorMessage.should.equal('Array is empty.', 'Wrong error message');
  }));

  it('empty array allowed should verify', helper.mochaAsync(async() => {
    const array = ARRAY();
    const result = await array.isValid([], {
      noEmptyArrays: false
    });
    result.should.be.ok();
  }));
});