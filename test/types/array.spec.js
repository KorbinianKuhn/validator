const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const ARRAY = require('../../src/types/array');
const INTEGER = require('../../src/types/integer');

describe('ARRAY()', function () {
  it('required but null should fail', helper.mochaAsync(async() => {
    try {
      await ARRAY().validate(null, helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Required but is null.`);
    }
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    try {
      await ARRAY().validate(1234, helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Must be array but is number.`);
    }
  }));

  it('valid type should verify', helper.mochaAsync(async() => {
    let value = await ARRAY().validate([]);
    should.deepEqual(value, []);

    value = await ARRAY().validate(['test'], helper.DEFAULT_OPTIONS);
    should.deepEqual(value, ['test']);
  }));

  it('invalid length should fail', helper.mochaAsync(async() => {
    try {
      await ARRAY().minLength(5).validate(['test'], helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Must have at least 5 items.`);
    }

    try {
      await ARRAY().maxLength(5).validate([1, 2, 3, 4, 5, 6], helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Must have at most 5 items.');
    }

    try {
      await ARRAY().exactLength(3).validate(['test'], helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Must have exactly 3 items.');
    }
  }));

  it('valid length should verify', helper.mochaAsync(async() => {
    let value = await ARRAY().minLength(1).validate(['test'], helper.DEFAULT_OPTIONS);
    value.should.deepEqual(['test']);

    value = await ARRAY().maxLength(1).validate(['test'], helper.DEFAULT_OPTIONS);
    value.should.deepEqual(['test']);

    value = await ARRAY().exactLength(1).validate(['test'], helper.DEFAULT_OPTIONS);
    value.should.deepEqual(['test']);
  }));

  it('array with invalid types should fail', helper.mochaAsync(async() => {
    try {
      await ARRAY(INTEGER()).validate(['test'], helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.have.property(0, 'Must be integer but is string.');
    }
  }));

  it('array with valid types should verify', helper.mochaAsync(async() => {
    const value = await ARRAY(INTEGER()).validate([1, 2, 3], helper.DEFAULT_OPTIONS);
    value.should.deepEqual([1, 2, 3]);
  }));

  it('empty array should fail', helper.mochaAsync(async() => {
    try {
      await ARRAY().validate([], helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal('Array is empty.');
    }
  }));

  it('empty array allowed should verify', helper.mochaAsync(async() => {
    const value = await ARRAY().validate([], {
      noEmptyArrays: false
    });
    value.should.deepEqual([]);
  }));
});
