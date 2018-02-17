const should = require('should');
const helper = require('../helper');
const Validator = require('../../index').Validator;

const validator = Validator();

describe('Boolean()', () => {
  describe('required()', () => {
    it('undefined should throw', async () => {
      const promise = validator.Boolean()
        .required(true)
        .validate();
      await helper.throw(promise, 'Required but is undefined.');
    });

    it('undefined should verify', async () => {
      const actual = await validator.Boolean()
        .required(false)
        .validate();
      should.equal(actual, undefined);
    });
  });

  it('invalid type should fail', async () => {
    for (const value of ['true', 1, 0]) {
      await helper.throw(validator.Boolean().validate(value),`Must be boolean but is ${typeof value}.`);
    }
  });

  it('valid type should verify', async () => {
    for (const value of [true, false]) {
      const result = await validator.Boolean().validate(value);
      result.should.equal(value);
    }
  });

  describe('parse()', () => {
    it('parsed strings should fail', async () => {
      for (const value of ['1', '2']) {
        await helper.throw(validator.Boolean().parse(true).validate(value), `Must be boolean but is ${typeof value}.`);
      }
    });

    it('parsed strings should verify', async () => {
      let result = await validator.Boolean().parse(true).validate('true');
      result.should.equal(true);

      result = await validator.Boolean().parse(true).validate('false');
      result.should.equal(false);
    });
  });

  describe('default()', () => {
    it('invalid default value should throw', async () => {
      const func = () => validator.Boolean().default('invalid');
      await helper.throw(func, 'Must be boolean.');
    });

    it('valid default value should verify', async () => {
      let result = await validator.Boolean().default(true).validate();
      result.should.deepEqual(true);

      result = await validator.Boolean().default(true).validate(false);
      result.should.deepEqual(false);
    });
  });

  describe('toObject()', () => {
    it('should return object small description', async () => {
      const actual = validator.Boolean()
        .default(true)
        .toObject();
      actual.should.deepEqual({
        type: 'boolean',
        default: true,
        required: true
      });
    });

    it('should return object full description', async () => {
      const actual = validator.Boolean()
        .name('name')
        .description('description')
        .default(true)
        .example(false)
        .examples(true, false)
        .required(true)
        .toObject();
      actual.should.deepEqual({
        type: 'boolean',
        name: 'name',
        description: 'description',
        default: true,
        example: false,
        examples: [true, false],
        required: true,
      });
    });
  });
});
