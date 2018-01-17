const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const ARRAY = require('../../src/types/array');
const OBJECT = require('../../src/types/object');
const INTEGER = require('../../src/types/integer');

describe('ARRAY()', function () {
  it('required but null should fail', helper.mochaAsync(async() => {
    const result = await helper.shouldThrow(async() => ARRAY().validate(null, helper.DEFAULT_OPTIONS));
    result.should.equal('Required but is null.');
  }));

  it('null and undefined should verify', helper.mochaAsync(async() => {
    let result = await ARRAY().validate(null);
    should.equal(result, null);

    result = await ARRAY().validate(undefined);
    should.equal(result, undefined);
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    const result = await helper.shouldThrow(async() => ARRAY().validate(1234, helper.DEFAULT_OPTIONS));
    result.should.equal('Must be array but is number.');
  }));

  it('valid type should verify', helper.mochaAsync(async() => {
    let value = await ARRAY().validate([]);
    should.deepEqual(value, []);

    value = await ARRAY().validate(['test'], helper.DEFAULT_OPTIONS);
    should.deepEqual(value, ['test']);
  }));

  it('invalid length should fail', helper.mochaAsync(async() => {
    let result = await helper.shouldThrow(async() => ARRAY().min(5).validate(['test'], helper.DEFAULT_OPTIONS));
    result.should.equal(`Must have at least 5 items.`);

    result = await helper.shouldThrow(async() => ARRAY().max(5).validate([1, 2, 3, 4, 5, 6], helper.DEFAULT_OPTIONS));
    result.should.equal(`Must have at most 5 items.`);

    result = await helper.shouldThrow(async() => ARRAY().length(3).validate(['test'], helper.DEFAULT_OPTIONS));
    result.should.equal(`Must have exactly 3 items.`);
  }));

  it('valid length should verify', helper.mochaAsync(async() => {
    let value = await ARRAY().min(1).validate(['test'], helper.DEFAULT_OPTIONS);
    value.should.deepEqual(['test']);

    value = await ARRAY().max(1).validate(['test'], helper.DEFAULT_OPTIONS);
    value.should.deepEqual(['test']);

    value = await ARRAY().length(1).validate(['test'], helper.DEFAULT_OPTIONS);
    value.should.deepEqual(['test']);
  }));

  it('array with invalid types should fail', helper.mochaAsync(async() => {
    const result = await helper.shouldThrow(async() => ARRAY(INTEGER()).validate(['test'], helper.DEFAULT_OPTIONS));
    result.should.deepEqual({
      0: 'Must be integer but is string.'
    });
  }));

  it('array with valid types should verify', helper.mochaAsync(async() => {
    const value = await ARRAY(INTEGER()).validate([1, 2, 3], helper.DEFAULT_OPTIONS);
    value.should.deepEqual([1, 2, 3]);
  }));

  it('empty array should fail', helper.mochaAsync(async() => {
    const result = await helper.shouldThrow(async() => ARRAY().validate([], helper.DEFAULT_OPTIONS));
    result.should.equal('Array is empty.');
  }));

  it('empty array allowed should verify', helper.mochaAsync(async() => {
    const value = await ARRAY().validate([], {
      noEmptyArrays: false
    });
    value.should.deepEqual([]);
  }));

  it('parsed strings should verify', helper.mochaAsync(async() => {
    let result = await ARRAY().validate('a,b,c', {
      parseToType: true
    });

    result.should.deepEqual(['a', 'b', 'c']);

    result = await ARRAY().validate('["a","b","c"]', {
      parseToType: true
    });

    result.should.deepEqual(['a', 'b', 'c']);
  }));

  it('invalid default value should throw', helper.mochaAsync(async() => {
    const result = await helper.shouldThrow(async() => ARRAY().default('invalid'));
    result.message.should.equal('Must be array.');
  }));

  it('valid default value should verify', helper.mochaAsync(async() => {
    let result = await ARRAY().default([1, 2, 3]).validate();
    result.should.deepEqual([1, 2, 3]);

    result = await ARRAY().default([1, 2, 3]).validate([1, 2]);
    result.should.deepEqual([1, 2]);
  }));

  it('empty should verify', helper.mochaAsync(async() => {
    let result = await helper.shouldThrow(
      async() => await ARRAY(undefined, {
        noEmptyArrays: true
      }).empty(false).validate([])
    );
    result.should.equal('Array is empty.');

    result = await ARRAY(undefined, {
      noEmptyArrays: true
    }).empty(true).validate([]);
    result.should.deepEqual([]);
  }));

  it('duplicate items should fail', helper.mochaAsync(async() => {
    let result = await helper.shouldThrow(
      async() => await ARRAY().unique(true).validate(['a', 'b', 'a'])
    );
    result.should.equal('Values must be unique.');

    result = await helper.shouldThrow(
      async() => await ARRAY(OBJECT({
        id: INTEGER()
      })).unique(true).validate([{
        id: 1
      }, {
        id: 2
      }, {
        id: 1
      }])
    );
    result.should.equal('Values must be unique.');
  }));

  it('duplicate items should verify', helper.mochaAsync(async() => {
    let result = await await ARRAY().validate(['a', 'b', 'a']);
    result.should.deepEqual(['a', 'b', 'a']);

    const array = [{
      id: 1
    }, {
      id: 2
    }, {
      id: 1
    }];
    result = await ARRAY(OBJECT({
      id: INTEGER()
    })).validate(array);
    result.should.deepEqual(array);
  }));

  it('deprecated functions minLength, maxLength, exactLength, defaultValue should verify', async() => {
    let result = await ARRAY().defaultValue([1, 2, 3]).validate();
    result.should.deepEqual([1, 2, 3]);

    result = await ARRAY().minLength(3).validate([1, 2, 3]);
    result.should.deepEqual([1, 2, 3]);

    result = await ARRAY().maxLength(3).validate([1, 2, 3]);
    result.should.deepEqual([1, 2, 3]);

    result = await ARRAY().exactLength(3).validate([1, 2, 3]);
    result.should.deepEqual([1, 2, 3]);
  });
});
