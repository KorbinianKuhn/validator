const should = require('should');
const moment = require('moment');
const helper = require('../helper');
const Validator = require('../../index').Validator;

const validator = Validator();

describe('Date()', () => {
  describe('required()', () => {
    it('undefined should throw', async () => {
      const promise = validator
        .Date()
        .required(true)
        .validate();
      await helper.throw(promise, 'Required but is undefined.');
    });

    it('undefined should verify', async () => {
      const actual = await validator
        .Date()
        .required(false)
        .validate();
      should.equal(actual, undefined);
    });
  });

  it('invalid type should fail', async () => {
    for (const value of ['true', 10, '2017-10-34T00:00:00Z']) {
      await helper.throw(
        validator.Date().validate(value),
        `Not a valid date. Must match format '${helper.DATE_FORMAT}'.`
      );
    }
  });

  it('valid type should verify', async () => {
    const date = moment.utc();
    const result = await validator.Date().validate(date.toISOString());
    result.should.deepEqual(date.toDate());
  });

  describe('default()', () => {
    it('invalid default value should throw', async () => {
      const func = () => validator.Date().default('2018-01-01');
      await helper.throw(
        func,
        `Not a valid date. Must match format '${helper.DATE_FORMAT}'.`
      );
    });

    it('valid default value should verify', async () => {
      let result = await validator
        .Date()
        .parse(false)
        .default('2018-01-01T00:00:00.000Z')
        .validate();
      result.should.equal('2018-01-01T00:00:00.000Z');

      result = await validator
        .Date()
        .parse(false)
        .default('2018-01-01T00:00:00.000Z')
        .validate('2019-01-01T00:00:00.000Z');
      result.should.equal('2019-01-01T00:00:00.000Z');
    });
  });

  it('valid format and value should verify', async () => {
    const result = await validator
      .Date()
      .parse(false)
      .format('YYYY-MM-DD')
      .validate('2018-01-01');
    result.should.equal('2018-01-01');
  });

  describe('required()', () => {
    it('should return parsed date', async () => {
      let result = await validator
        .Date()
        .parse(false)
        .validate('2018-01-01T00:00:00.000Z');
      result.should.equal('2018-01-01T00:00:00.000Z');

      const date = moment(moment.utc());
      result = await validator
        .Date()
        .parse(true)
        .validate(date.format('YYYY-MM-DD[T]HH:mm:ss.SSSZ'));
      result.should.deepEqual(date.toDate());
    });
  });

  describe('min()', () => {
    it('test minimum date', async () => {
      const date = validator
        .Date()
        .parse(false)
        .min(moment.utc('2018-01-01').toDate());

      await helper.throw(
        date.validate('2017-01-01T00:00:00.000Z'),
        `Must be at minimum '2018-01-01T00:00:00.000Z'.`
      );

      const result = await date.validate('2019-01-01T00:00:00.000Z');
      result.should.equal('2019-01-01T00:00:00.000Z');
    });
  });

  describe('max()', () => {
    it('test maximum date', async () => {
      const date = validator
        .Date()
        .parse(false)
        .max(moment.utc('2018-01-01').toDate());

      await helper.throw(
        date.validate('2019-01-01T00:00:00.000Z'),
        `Must be at maximum '2018-01-01T00:00:00.000Z'.`
      );

      const result = await date.validate('2017-01-01T00:00:00.000Z');
      result.should.equal('2017-01-01T00:00:00.000Z');
    });
  });

  describe('strict()', () => {
    it('test no strict date validation', async () => {
      const date = validator
        .Date()
        .parse(false)
        .strict(false);
      const result = await date.validate('2017-01-01');
      result.should.equal('2017-01-01');
    });
  });

  describe('utc()', () => {
    it('test no utc date parsing', async () => {
      const date = validator
        .Date()
        .utc(false)
        .parse(false);
      const datestring = moment().toISOString();
      const result = await date.validate(datestring);
      result.should.equal(datestring);
    });
  });

  describe('toObject()', () => {
    it('should return object small description', async () => {
      const actual = validator.Date().toObject();
      actual.should.deepEqual({
        type: 'date',
        required: true,
        strict: true,
        utc: true,
        format: 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
      });
    });

    it('should return object full description', async () => {
      const actual = validator
        .Date()
        .name('name')
        .description('description')
        .default('2017-01-01T00:00:00.000Z')
        .example('2017-01-01T00:00:00.000Z')
        .examples('2017-01-01T00:00:00.000Z', '2018-01-01T00:00:00.000Z')
        .required(true)
        .parse(true)
        .min('2017-01-01T00:00:00.000Z')
        .max('2017-01-01T00:00:00.000Z')
        .toObject();
      actual.should.deepEqual({
        type: 'date',
        name: 'name',
        description: 'description',
        default: '2017-01-01T00:00:00.000Z',
        example: '2017-01-01T00:00:00.000Z',
        examples: ['2017-01-01T00:00:00.000Z', '2018-01-01T00:00:00.000Z'],
        required: true,
        format: 'YYYY-MM-DD[T]HH:mm:ss.SSSZ',
        utc: true,
        strict: true,
        min: '2017-01-01T00:00:00.000Z',
        max: '2017-01-01T00:00:00.000Z'
      });
    });

    it('type raml should verify', async () => {
      const object = validator.Date().toObject({ type: 'raml' });
      object.should.be.type('object');
    });
  });
});
