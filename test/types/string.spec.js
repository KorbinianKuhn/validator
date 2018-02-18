const should = require('should');
const helper = require('../helper');

const Validator = require('../../index').Validator;

const validator = Validator();

describe('String()', () => {
  describe('required()', () => {
    it('undefined should throw', async () => {
      const promise = validator.String()
        .required(true)
        .validate();
      await helper.throw(promise, 'Required but is undefined.');
    });

    it('undefined should verify', async () => {
      const actual = await validator.String()
        .required(false)
        .validate();
      should.equal(actual, undefined);
    });
  });

  it('invalid type should fail', async () => {
    for (const value of [0, [], {}]) {
      await helper.throw(validator.String().validate(value), `Must be string but is ${typeof value}.`);
    }
  });

  it('valid type should verify', async () => {
    for (const value of ['1234', 'test']) {
      const result = await validator.String().validate(value);
      result.should.equal(value);
    }
  });

  describe('min()', () => {
    it('invalid length should fail', async () => {
      await helper.throw(validator.String().min(5).validate('test'), `Must have at least 5 characters.`);
    });

    it('valid length should verify', async () => {
      const value = await validator.String().min(3).validate('test');
      value.should.equal('test');
    });
  });

  describe('max()', () => {
    it('invalid length should fail', async () => {
      await helper.throw(validator.String().max(3).validate('test'), 'Must have at most 3 characters.');
    });

    it('valid length should verify', async () => {
      const value = await validator.String().max(5).validate('test');
      value.should.equal('test');
    });
  });

  describe('length()', () => {
    it('invalid length should fail', async () => {
      await helper.throw(validator.String().length(3).validate('test'), 'Must have exactly 3 characters.');
    });

    it('valid length should verify', async () => {
      const value = await validator.String().length(4).validate('test');
      value.should.equal('test');
    });
  });

  describe('empt()', () => {
    it('empty string should fail', async () => {
      await helper.throw(validator.String().validate(''), 'String is empty.');
    });

    it('empty string allowed should verify', async () => {
      const result = await validator.String().empty(true).validate('');
      result.should.equal('');
    });
  });

  describe('default()', () => {
    it('invalid default value should throw', async () => {
      const func = () => validator.String().default(1234);
      await helper.throw(func, 'Must be string.');
    });

    it('valid default value should verify', async () => {
      const result = await validator.String().default('default').validate();
      result.should.equal('default');
    });

    it('valid default value should return given value', async () => {
      const result = await validator.String().default('default').validate('test');
      result.should.equal('test');
    });
  });

  describe('trim()', () => {
    it('trim should verify', async () => {
      const result = await validator.String().trim(true).validate('  test ');
      result.should.equal('test');
    });

    it('trim should result in empty string and throw', async () => {
      await helper.throw(validator.String().validate(' '), 'String is empty.');
    });

    it('should not trim', async () => {
      const result = await validator.String().trim(false).validate(' test ');
      result.should.equal(' test ');
    });
  });

  describe('toObject()', () => {
    it('should return object small description', async () => {
      const actual = validator.String()
        .default('test')
        .toObject();
      actual.should.deepEqual({
        type: 'string',
        default: 'test',
        required: true,
        empty: false,
        trim: true
      });
    });

    it('should return object full description', async () => {
      const actual = validator.String()
        .name('name')
        .description('description')
        .default('test')
        .example('test')
        .examples('test', 'hello')
        .required(true)
        .min(0)
        .max(10)
        .length(10)
        .trim(true)
        .toObject();
      actual.should.deepEqual({
        type: 'string',
        name: 'name',
        description: 'description',
        default: 'test',
        example: 'test',
        examples: ['test', 'hello'],
        required: true,
        empty: false,
        length: 10,
        min: 0,
        max: 10,
        trim: true
      });
    });

    it('type raml should verify', async () => {
      const object = validator.String().default('test').toObject({ type: 'raml' });
      object.should.be.type('object');
    });
  });
});
