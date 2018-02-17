const should = require('should');
const helper = require('../helper');

const Validator = require('../../index').Validator;

const validator = Validator();

const testFunction = value => value;
const throwFunction = () => {
  throw new Error('Custom error message.');
};

describe('Function()', () => {
  describe('constructor()', () => {
    it('no function should throw', () => {
      (() => {
        validator.Function();
      }).should.throw('Missing function.');
    });

    it('invalid function should throw', () => {
      (() => {
        validator.Function('invalid');
      }).should.throw('Not a function.');
    });
  });

  describe('required()', () => {
    it('undefined should throw', async () => {
      const promise = validator.Function(testFunction)
        .required(true)
        .validate();
      await helper.throw(promise, 'Required but is undefined.');
    });

    it('undefined should verify', async () => {
      const actual = await validator.Function(testFunction)
        .required(false)
        .validate();
      should.equal(actual, undefined);
    });
  });

  describe('validate()', () => {
    it('function should verify', async () => {
      let result = await validator.Function(testFunction).validate('test');
      result.should.equal('test');

      result = await validator.Function(testFunction).validate('test');
      result.should.equal('test');
    });

    it('function should throw custom error message', async () => {
      const promise = validator.Function(throwFunction).validate('test');
      await helper.throw(promise, 'Custom error message.');
    });
  });

  describe('default()', () => {
    it('should return default value', async () => {
      const result = await validator.Function(testFunction).default('test').validate();
      result.should.equal('test');
    });

    it('should return value', async () => {
      const result = await validator.Function(testFunction).default('test').validate('hello');
      result.should.equal('hello');
    });
  });

  describe('toObject()', () => {
    it('should return object full description', async () => {
      const actual = validator.Function(testFunction)
        .name('name')
        .description('description')
        .default('a')
        .example('a')
        .examples('a', 'b')
        .required(true)
        .toObject();
      actual.should.deepEqual({
        type: 'function',
        name: 'name',
        description: 'description',
        default: 'a',
        example: 'a',
        examples: ['a', 'b'],
        required: true,
      });
    });
  });
});
