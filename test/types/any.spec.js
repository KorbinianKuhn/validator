const should = require('should');
const helper = require('../helper');
const Validator = require('../../index').Validator;

const validator = Validator();

describe('Any()', () => {
  describe('required()', () => {
    it('undefined should throw', async () => {
      const promise = validator.Any()
        .required(true)
        .validate();
      await helper.throw(promise, 'Required but is undefined.');
    });

    it('undefined should verify', async () => {
      const actual = await validator.Any()
        .required(false)
        .validate();
      should.equal(actual, undefined);
    });
  });

  describe('default()', () => {
    it('should return default value', async () => {
      const actual = await validator.Any()
        .default('test')
        .validate();
      actual.should.equal('test');
    });

    it('should return given value', async () => {
      const actual = await validator.Any()
        .default('test')
        .validate('hello');
      actual.should.equal('hello');
    });
  });

  describe('toObject()', () => {
    it('should return object small description', async () => {
      const actual = validator.Any()
        .default('test')
        .toObject();
      actual.should.deepEqual({
        type: 'any',
        default: 'test',
        required: true,
        parse: false
      });
    });

    it('should return object full description', async () => {
      const actual = validator.Any()
        .name('name')
        .description('description')
        .default('test')
        .example('test')
        .examples('test', 'hello')
        .required(true)
        .parse(true)
        .toObject();
      actual.should.deepEqual({
        type: 'any',
        name: 'name',
        description: 'description',
        default: 'test',
        example: 'test',
        examples: ['test', 'hello'],
        required: true,
        parse: true
      });
    });
  });
});
