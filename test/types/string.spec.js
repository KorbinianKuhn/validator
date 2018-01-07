const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const STRING = require('../../src/types/string');

describe('STRING()', function () {
  it('required but null should fail', helper.mochaAsync(async() => {
    const message = await helper.shouldThrow(async() => STRING().validate(null, helper.DEFAULT_OPTIONS));
    message.should.equal(`Required but is null.`);
  }));

  it('null and undefined should verify', helper.mochaAsync(async() => {
    let result = await STRING().validate(null);
    should.equal(result, null);

    result = await STRING().validate(undefined);
    should.equal(result, undefined);
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    for (const value of [0, [], {}]) {
      const message = await helper.shouldThrow(async() => STRING().validate(value));
      message.should.equal(`Must be string but is ${typeof value}.`);
    }
  }));

  it('valid type should verify', helper.mochaAsync(async() => {
    for (const value of ['1234', 'test']) {
      const result = await STRING().validate(value);
      result.should.equal(value);
    }
  }));

  it('invalid length should fail', helper.mochaAsync(async() => {
    let message = await helper.shouldThrow(async() => STRING().minLength(5).validate('test', helper.DEFAULT_OPTIONS));
    message.should.equal(`Must have at least 5 characters.`);

    message = await helper.shouldThrow(async() => STRING().maxLength(3).validate('test', helper.DEFAULT_OPTIONS));
    message.should.equal('Must have at most 3 characters.');

    message = await helper.shouldThrow(async() => STRING().exactLength(3).validate('test', helper.DEFAULT_OPTIONS));
    message.should.equal('Must have exactly 3 characters.');
  }));

  it('valid length should verify', helper.mochaAsync(async() => {
    let value = await STRING().minLength(3).validate('test', helper.DEFAULT_OPTIONS);
    value.should.equal('test');

    value = await STRING().maxLength(5).validate('test', helper.DEFAULT_OPTIONS);
    value.should.equal('test');

    value = await STRING().exactLength(4).validate('test', helper.DEFAULT_OPTIONS);
    value.should.equal('test');
  }));


  it('empty string should fail', helper.mochaAsync(async() => {
    const message = await helper.shouldThrow(async() => STRING().validate('', helper.DEFAULT_OPTIONS));
    message.should.equal('String is empty.');
  }));

  it('empty string allowed should verify', helper.mochaAsync(async() => {
    const string = STRING();
    const result = await string.validate('', {
      noEmptyStrings: false
    });
    result.should.equal('');
  }));

  it('invalid default value should throw', helper.mochaAsync(async() => {
    const result = await helper.shouldThrow(async() => STRING().defaultValue(1234));
    result.message.should.equal('Must be string.');
  }));

  it('valid default value should verify', helper.mochaAsync(async() => {
    let result = await STRING().defaultValue('default').validate();
    result.should.equal('default');

    result = await STRING().defaultValue('default').validate('test');
    result.should.equal('test');
  }));

  it('empty should verify', helper.mochaAsync(async() => {
    let result = await helper.shouldThrow(
      async() => await STRING({
        noEmptyStrings: true
      }).empty(false).validate('')
    );
    result.should.equal('String is empty.');

    result = await STRING({
      noEmptyStrings: true
    }).empty(true).validate('');
    result.should.equal('');
  }));

  it('trim should verify', helper.mochaAsync(async() => {
    const result = await STRING().trim(true).validate(' test ');
    result.should.equal('test');
  }));

  it('trim should result in empty string', helper.mochaAsync(async() => {
    const result = await helper.shouldThrow(
      async() => await STRING(helper.DEFAULT_OPTIONS).validate(' ')
    );
    result.should.equal('String is empty.');
  }));
});
