const should = require('should');
const helper = require('./helper');
const Validator = require('../../index').Validator;

const validator = Validator();

describe('Boolean()', () => {
  it('required but null should fail', helper.mochaAsync(async () => {
    const result = await helper.shouldThrow(async () => validator.Boolean().validate(null));
    result.should.equal('Required but is null.');
  }));

  it('null and undefined should verify', helper.mochaAsync(async () => {
    let result = await validator.Boolean().validate(null);
    should.equal(result, null);

    result = await validator.Boolean().validate(undefined);
    should.equal(result, undefined);
  }));

  it('invalid type should fail', helper.mochaAsync(async () => {
    for (const value of ['true', 1, 0]) {
      const result = await helper.shouldThrow(async () => validator.Boolean().validate(value));
      result.should.equal(`Must be boolean but is ${typeof value}.`);
    }
  }));

  it('valid type should verify', helper.mochaAsync(async () => {
    for (const value of [true, false]) {
      const result = await validator.Boolean().validate(value);
      result.should.equal(value);
    }
  }));

  it('parsed strings should fail', helper.mochaAsync(async () => {
    for (const value of ['1', '2']) {
      const result = await helper.shouldThrow(async () => validator.Boolean().validate(value, {
        parseToType: true
      }));
      result.should.equal(`Must be boolean but is ${typeof value}.`);
    }
  }));

  it('parsed strings should verify', helper.mochaAsync(async () => {
    let result = await validator.Boolean().validate('true', {
      parseToType: true
    });
    result.should.equal(true);

    result = await validator.Boolean().validate('false', {
      parseToType: true
    });
    result.should.equal(false);
  }));

  it('invalid default value should throw', helper.mochaAsync(async () => {
    const result = await helper.shouldThrow(async () => validator.Boolean().default('invalid'));
    result.message.should.equal('Must be boolean.');
  }));

  it('valid default value should verify', helper.mochaAsync(async () => {
    let result = await validator.Boolean().default(true).validate();
    result.should.deepEqual(true);

    result = await validator.Boolean().default(true).validate(false);
    result.should.deepEqual(false);
  }));

  it.skip('toObject() should verify', async () => {
    const schema = validator.Boolean().name('My Boolean').description('A very nice boolean.').example(true);
    console.log(schema.toObject());
  });
});
