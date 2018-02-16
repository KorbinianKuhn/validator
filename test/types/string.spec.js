const should = require('should');
const helper = require('./helper');

const Validator = require('../../index').Validator;

const validator = Validator();

describe('String()', () => {
  it('required but null should fail', helper.mochaAsync(async () => {
    const message = await helper.shouldThrow(async () => validator.String().validate(null, helper.DEFAULT_OPTIONS));
    message.should.equal(`Required but is null.`);
  }));

  it('null and undefined should verify', helper.mochaAsync(async () => {
    let result = await validator.String().validate(null);
    should.equal(result, null);

    result = await validator.String().validate(undefined);
    should.equal(result, undefined);
  }));

  it('invalid type should fail', helper.mochaAsync(async () => {
    for (const value of [0, [], {}]) {
      const message = await helper.shouldThrow(async () => validator.String().validate(value));
      message.should.equal(`Must be string but is ${typeof value}.`);
    }
  }));

  it('valid type should verify', helper.mochaAsync(async () => {
    for (const value of ['1234', 'test']) {
      const result = await validator.String().validate(value);
      result.should.equal(value);
    }
  }));

  it('invalid length should fail', helper.mochaAsync(async () => {
    let message = await helper.shouldThrow(async () => validator.String().min(5).validate('test', helper.DEFAULT_OPTIONS));
    message.should.equal(`Must have at least 5 characters.`);

    message = await helper.shouldThrow(async () => validator.String().max(3).validate('test', helper.DEFAULT_OPTIONS));
    message.should.equal('Must have at most 3 characters.');

    message = await helper.shouldThrow(async () => validator.String().length(3).validate('test', helper.DEFAULT_OPTIONS));
    message.should.equal('Must have exactly 3 characters.');
  }));

  it('valid length should verify', helper.mochaAsync(async () => {
    let value = await validator.String().min(3).validate('test', helper.DEFAULT_OPTIONS);
    value.should.equal('test');

    value = await validator.String().max(5).validate('test', helper.DEFAULT_OPTIONS);
    value.should.equal('test');

    value = await validator.String().length(4).validate('test', helper.DEFAULT_OPTIONS);
    value.should.equal('test');
  }));


  it('empty string should fail', helper.mochaAsync(async () => {
    const message = await helper.shouldThrow(async () => validator.String().validate('', helper.DEFAULT_OPTIONS));
    message.should.equal('String is empty.');
  }));

  it('empty string allowed should verify', helper.mochaAsync(async () => {
    const string = validator.String();
    const result = await string.validate('', {
      noEmptyStrings: false
    });
    result.should.equal('');
  }));

  it('invalid default value should throw', helper.mochaAsync(async () => {
    const result = await helper.shouldThrow(async () => validator.String().default(1234));
    result.message.should.equal('Must be string.');
  }));

  it('valid default value should verify', helper.mochaAsync(async () => {
    let result = await validator.String().default('default').validate();
    result.should.equal('default');

    result = await validator.String().default('default').validate('test');
    result.should.equal('test');
  }));

  it('empty should verify', helper.mochaAsync(async () => {
    let result = await helper.shouldThrow(async () => validator.String({
      noEmptyStrings: true
    }).empty(false).validate(''));
    result.should.equal('String is empty.');

    result = await validator.String({
      noEmptyStrings: true
    }).empty(true).validate('');
    result.should.equal('');
  }));

  it('trim should verify', helper.mochaAsync(async () => {
    const result = await validator.String().trim(true).validate(' test ');
    result.should.equal('test');
  }));

  it('trim should result in empty string', helper.mochaAsync(async () => {
    const result = await helper.shouldThrow(async () => validator.String(helper.DEFAULT_OPTIONS).validate(' '));
    result.should.equal('String is empty.');
  }));

  it.skip('toObject() should verify', async () => {
    const schema = validator.String().min(2).max(20).name('My String').description('A very nice string.').example('test');
    console.log(schema.toObject());
  });
});
