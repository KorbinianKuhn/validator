const should = require('should');
const helper = require('./helper');
const Validator = require('../../index').Validator;

const validator = Validator();

describe('validator.Enum()', () => {
  it('no values should throw', () => {
    (() => {
      validator.Enum();
    }).should.throw('Missing values for enum.');
  });

  it('invalid values should throw', () => {
    (() => {
      validator.Enum('invalid');
    }).should.throw('Values must be an array.');
  });

  it('required but null should fail', helper.mochaAsync(async () => {
    const message = await helper.shouldThrow(async () => validator.Enum(['a', 'b', 'c']).validate(null));
    message.should.equal('Required but is null.');
  }));

  it('null and undefined should verify', helper.mochaAsync(async () => {
    let result = await validator.Enum(['a', 'b', 'c']).validate(null);
    should.equal(result, null);

    result = await validator.Enum(['a', 'b', 'c']).validate(undefined);
    should.equal(result, undefined);
  }));

  it('invalid type should fail', helper.mochaAsync(async () => {
    for (const value of ['d', 1, 0]) {
      const message = await helper.shouldThrow(async () => validator.Enum(['a', 'b', 'c']).validate(value));
      message.should.equal(`'${value}' is not one of [a,b,c].`);
    }
  }));

  it('valid type should verify', helper.mochaAsync(async () => {
    for (const value of ['a', 'b']) {
      const result = await validator.Enum(['a', 'b', 'c']).validate(value);
      result.should.equal(value);
    }
  }));

  it('valid default value should verify', helper.mochaAsync(async () => {
    let result = await validator.Enum(['a', 'b', 'c']).default('a').validate();
    result.should.deepEqual('a');

    result = await validator.Enum(['a', 'b', 'c']).default('a').validate('b');
    result.should.deepEqual('b');
  }));

  it.skip('toObject() should verify', async () => {
    const schema = validator.Enum([1, 2, 3]).name('My Enum').description('A very nice enum.').example(2);
    console.log(schema.toObject());
  });
});
