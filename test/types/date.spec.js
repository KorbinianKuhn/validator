const assert = require('assert');
const should = require('should');
const moment = require('moment');
const helper = require('./helper');
const DATE = require('../../src/types/date');

describe('DATE()', function () {
  it('required but null should fail', helper.mochaAsync(async() => {
    const result = await helper.shouldThrow(async() => DATE().validate(null, helper.DEFAULT_OPTIONS));
    result.should.equal('Required but is null.');
  }));

  it('null and undefined should verify', helper.mochaAsync(async() => {
    let result = await DATE().validate(null);
    should.equal(result, null);

    result = await DATE().validate(undefined);
    should.equal(result, undefined);
  }));

  it('invalid type should fail', helper.mochaAsync(async() => {
    for (const value of ['true', 10, '2017-10-34T00:00:00Z']) {
      const result = await helper.shouldThrow(async() => DATE().validate(value));
      result.should.equal(`Not a valid date. Must match format '${helper.DATE_FORMAT}'`);
    }
  }));

  it('valid type should verify', helper.mochaAsync(async() => {
    const result = await DATE().validate('2018-10-20T00:00:00');
    result.should.equal('2018-10-20T00:00:00');
  }));

  it('invalid default value should throw', helper.mochaAsync(async() => {
    const result = await helper.shouldThrow(async() => DATE().defaultValue('2018-01-01'));
    result.message.should.equal(`Not a valid date. Must match format '${helper.DATE_FORMAT}'`);
  }));

  it('valid default value should verify', helper.mochaAsync(async() => {
    let result = await DATE().defaultValue('2018-01-01T00:00:00').validate();
    result.should.equal('2018-01-01T00:00:00');

    result = await DATE().defaultValue('2018-01-01T00:00:00').validate('2019-01-01T00:00:00');
    result.should.equal('2019-01-01T00:00:00');
  }));

  it('valid format and value should verify', helper.mochaAsync(async() => {
    let result = await DATE().format('YYYY-MM-DD').validate('2018-01-01');
    result.should.equal('2018-01-01');
  }));
});
