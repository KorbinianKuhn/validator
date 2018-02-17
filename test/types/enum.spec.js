const should = require('should');
const helper = require('../helper');
const Validator = require('../../index').Validator;

const validator = Validator();

describe('validator.Enum()', () => {
  it('no values should throw', async () => {
    const func = () => validator.Enum();
    await helper.throw(func, 'Missing values for enum.');
  });

  it('invalid values should throw', async () => {
    const func = () => validator.Enum('invalid');
    await helper.throw(func, 'Values must be an array.');
  });

  describe('required()', () => {
    it('undefined should throw', async () => {
      const promise = validator.Enum([])
        .required(true)
        .validate();
      await helper.throw(promise, 'Required but is undefined.');
    });

    it('undefined should verify', async () => {
      const actual = await validator.Enum([])
        .required(false)
        .validate();
      should.equal(actual, undefined);
    });
  });

  it('invalid type should fail', async () => {
    for (const value of ['d', 1, 0]) {
      await helper.throw(validator.Enum(['a', 'b', 'c']).validate(value), `'${value}' is not one of [a,b,c].`);
    }
  });

  it('valid type should verify', async () => {
    for (const value of ['a', 'b']) {
      const result = await validator.Enum(['a', 'b', 'c']).validate(value);
      result.should.equal(value);
    }
  });

  describe('default()', () => {
    it('should return default value', async () => {
      const result = await validator.Enum(['a', 'b', 'c']).default('a').validate();
      result.should.equal('a');
    });

    it('should return value', async () => {
      const result = await validator.Enum(['a', 'b', 'c']).default('a').validate('b');
      result.should.equal('b');
    });

    it('invalid default value should throw', async () => {
      const func = () => validator.Enum(['a']).default('b');
      await helper.throw(func, 'Default value must be part of enum.');
    });
  });


  describe('toObject()', () => {
    it('should return object full description', async () => {
      const actual = validator.Enum(['a','b','c'])
        .name('name')
        .description('description')
        .default('a')
        .example('a')
        .examples('a', 'b')
        .required(true)
        .toObject();
      actual.should.deepEqual({
        type: 'enum',
        name: 'name',
        description: 'description',
        default: 'a',
        example: 'a',
        examples: ['a', 'b'],
        required: true,
        enum: ['a','b','c']
      });
    });
  });
});
