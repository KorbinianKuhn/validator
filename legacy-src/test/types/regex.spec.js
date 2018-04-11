const should = require('should');
const helper = require('../helper');
const Validator = require('../../index').Validator;

const validator = Validator();

describe('Regex()', () => {
  describe('constructor()', () => {
    it('no regex should throw', async () => {
      helper.throw(() => validator.Regex(), 'Invalid regular expression');
    });
  });

  describe('required()', () => {
    it('undefined should throw', async () => {
      const promise = validator
        .Regex(/[A-Z]/)
        .required(true)
        .validate();
      await helper.throw(promise, 'Required but is undefined.');
    });

    it('undefined should verify', async () => {
      const actual = await validator
        .Regex(/[A-Z]/)
        .required(false)
        .validate();
      should.equal(actual, undefined);
    });
  });

  describe('validate()', () => {
    it('invalid type should fail', async () => {
      for (const value of [1, true]) {
        await helper.throw(
          validator.Regex(/[A-Z]/).validate(value),
          `Must be string but is ${typeof value}.`
        );
      }
    });

    it('valid value should verify', async () => {
      const value = await validator.Regex(/[A-Z]/).validate('ABC');
      value.should.equal('ABC');
    });

    it('regex object should verify', async () => {
      const value = await validator.Regex(new RegExp(/[A-Z]/)).validate('ABC');
      value.should.equal('ABC');
    });

    it('invalid value should fail', async () => {
      await helper.throw(
        validator.Regex(/[A-Z]/).validate('abc'),
        'Value does not match regular expression.'
      );
    });
  });

  describe('min()', () => {
    it('invalid length should fail', async () => {
      await helper.throw(
        validator
          .Regex(/[A-Z]/)
          .min(5)
          .validate('ABC'),
        `Must have at least 5 characters.`
      );
    });

    it('valid length should verify', async () => {
      const value = await validator
        .Regex(/[A-Z]/)
        .min(3)
        .validate('ABC');
      value.should.equal('ABC');
    });
  });

  describe('max()', () => {
    it('invalid length should fail', async () => {
      await helper.throw(
        validator
          .Regex(/[A-Z]/)
          .max(3)
          .validate('ABCD'),
        'Must have at most 3 characters.'
      );
    });

    it('valid length should verify', async () => {
      const value = await validator
        .Regex(/[A-Z]/)
        .max(3)
        .validate('ABC');
      value.should.equal('ABC');
    });
  });

  describe('length()', () => {
    it('invalid length should fail', async () => {
      await helper.throw(
        validator
          .Regex(/[A-Z]/)
          .length(3)
          .validate('ABCD'),
        'Must have exactly 3 characters.'
      );
    });

    it('valid length should verify', async () => {
      const value = await validator
        .Regex(/[A-Z]/)
        .length(3)
        .validate('ABC');
      value.should.equal('ABC');
    });
  });

  describe('default()', () => {
    it('should throw', async () => {
      await helper.throw(
        () => validator.Regex(/[A-Z]/).default(1234),
        'Must be string.'
      );
    });

    it('should return default value', async () => {
      const result = await validator
        .Regex(/[A-Z]/)
        .default('ABC')
        .validate();
      result.should.equal('ABC');
    });

    it('should return value', async () => {
      const result = await validator
        .Regex(/[A-Z]/)
        .default('ABC')
        .validate('DEF');
      result.should.equal('DEF');
    });
  });

  describe('empty()', () => {
    it('should throw', async () => {
      await helper.throw(
        validator
          .Regex(/[A-Z]/)
          .empty(false)
          .validate(''),
        'String is empty.'
      );
    });

    it('should verify', async () => {
      const result = await validator
        .Regex(/[A-Z]/)
        .empty(true)
        .validate('');
      result.should.equal('');
    });
  });

  describe('message()', () => {
    it('should return custom message', async () => {
      const message = 'Must have only uppercase letters.';
      await helper.throw(
        validator
          .Regex(/[A-Z]/)
          .empty(false)
          .message(message)
          .validate('abc'),
        message
      );
    });
  });

  describe('toObject()', () => {
    it('should return object full description', async () => {
      const actual = validator
        .Regex(/A-Z/)
        .name('name')
        .description('description')
        .message('Englisch', 'en')
        .message('German', 'de')
        .default('test')
        .example('test')
        .examples('test', 'hello')
        .empty(true)
        .required(true)
        .min(0)
        .max(10)
        .length(5)
        .toObject();
      actual.should.deepEqual({
        type: 'regex',
        name: 'name',
        description: 'description',
        default: 'test',
        example: 'test',
        examples: ['test', 'hello'],
        required: true,
        min: 0,
        max: 10,
        length: 5,
        pattern: /A-Z/,
        empty: true
      });
    });

    it('type raml should verify', async () => {
      const object = validator
        .Regex(/A-Z/)
        .default('test')
        .toObject({ type: 'raml' });
      object.should.be.type('object');
    });
  });
});
