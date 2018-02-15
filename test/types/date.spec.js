const assert = require('assert');
const should = require('should');
const moment = require('moment');
const helper = require('./helper');
const DATE = require('../../src/types/date');

describe('DATE()', () => {
  it('required but null should fail', helper.mochaAsync(async () => {
    await helper.throw(DATE().validate(null, helper.DEFAULT_OPTIONS), 'Required but is null.');
  }));

  it('null and undefined should verify', helper.mochaAsync(async () => {
    let result = await DATE().validate(null);
    should.equal(result, null);

    result = await DATE().validate(undefined);
    should.equal(result, undefined);
  }));

  it('invalid type should fail', helper.mochaAsync(async () => {
    for (const value of ['true', 10, '2017-10-34T00:00:00Z']) {
      await helper.throw(DATE().validate(value), `Not a valid date. Must match format '${helper.DATE_FORMAT}'.`);
    }
  }));

  it('valid type should verify', helper.mochaAsync(async () => {
    const result = await DATE().validate('2018-10-20T00:00:00.000Z');
    result.should.equal('2018-10-20T00:00:00.000Z');
  }));

  it('invalid default value should throw', helper.mochaAsync(async () => {
    let error;
    try {
      DATE().default('2018-01-01');
    } catch (err) {
      error = err;
    }
    error.message.should.equal(`Not a valid date. Must match format '${helper.DATE_FORMAT}'.`);
  }));

  it('valid default value should verify', helper.mochaAsync(async () => {
    let result = await DATE().default('2018-01-01T00:00:00.000Z').validate();
    result.should.equal('2018-01-01T00:00:00.000Z');

    result = await DATE().default('2018-01-01T00:00:00.000Z').validate('2019-01-01T00:00:00.000Z');
    result.should.equal('2019-01-01T00:00:00.000Z');
  }));

  it('valid format and value should verify', helper.mochaAsync(async () => {
    const result = await DATE().format('YYYY-MM-DD').validate('2018-01-01');
    result.should.equal('2018-01-01');
  }));

  it('should return parsed date', helper.mochaAsync(async () => {
    let result = await DATE().parse(false).validate('2018-01-01T00:00:00.000Z');
    result.should.equal('2018-01-01T00:00:00.000Z');

    const date = moment(moment.utc());
    result = await DATE().parse(true).validate(date.format('YYYY-MM-DD[T]HH:mm:ss.SSSZ'));
    result.should.deepEqual(date.toDate());
  }));

  it('test minimum date', helper.mochaAsync(async () => {
    const date = DATE().min(moment.utc('2018-01-01').toDate());

    await helper.throw(date.validate('2017-01-01T00:00:00.000Z'), `Must be at minimum '2018-01-01T00:00:00.000Z'.`);

    const result = await date.validate('2019-01-01T00:00:00.000Z');
    result.should.equal('2019-01-01T00:00:00.000Z');
  }));

  it('test maximum date', helper.mochaAsync(async () => {
    const date = DATE().max(moment.utc('2018-01-01').toDate());

    await helper.throw(date.validate('2019-01-01T00:00:00.000Z'), `Must be at maximum '2018-01-01T00:00:00.000Z'.`);

    const result = await date.validate('2017-01-01T00:00:00.000Z');
    result.should.equal('2017-01-01T00:00:00.000Z');
  }));

  it('test no strict date validation', helper.mochaAsync(async () => {
    const date = DATE().strict(false);
    const result = await date.validate('2017-01-01');
    result.should.equal('2017-01-01');
  }));

  it('test no utc date parsing', helper.mochaAsync(async () => {
    const date = DATE().utc(false);
    const datestring = moment().toISOString();
    const result = await date.validate(datestring);
    result.should.equal(datestring);
  }));

  it.only('toObject() should verify', async () => {
    const schema = DATE().name('My Date').description('A very nice date.').example(moment.utc().toISOString());
    console.log(schema.toObject());
  });
});
