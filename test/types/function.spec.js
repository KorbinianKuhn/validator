const should = require('should');
const helper = require('./helper');

const Validator = require('../../index').Validator;

const validator = Validator();

const testFunction = value => value;
const throwFunction = () => {
  throw new Error('Custom error message.');
};

describe('Function()', () => {
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

  it('required but null should fail', helper.mochaAsync(async () => {
    const message = await helper.shouldThrow(async () => validator.Function(testFunction).validate(null));
    message.should.equal('Required but is null.');
  }));

  it('null and undefined should verify', helper.mochaAsync(async () => {
    let result = await validator.Function(testFunction).validate(null);
    should.equal(result, null);

    result = await validator.Function(testFunction).validate(undefined);
    should.equal(result, undefined);
  }));

  it('function should verify', helper.mochaAsync(async () => {
    let result = await validator.Function(testFunction).validate('test');
    result.should.equal('test');

    result = await validator.Function(testFunction).validate('test');
    result.should.equal('test');
  }));

  it('function should throw custom error message', helper.mochaAsync(async () => {
    const message = await helper.shouldThrow(async () => validator.Function(throwFunction).validate('test'));
    message.should.equal('Custom error message.');
  }));

  it('valid default value should verify', helper.mochaAsync(async () => {
    const result = await validator.Function(testFunction).default('test').validate();
    result.should.equal('test');
  }));
});
