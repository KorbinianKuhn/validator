const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { Validator } = require('./../../../index');

chai.use(chaiAsPromised);

describe('Validator()', () => {
  it('constructor()', () => {
    const validator = Validator();
  });

  it.skip('all types should be created with the validator', () => {
    const validator = Validator();
    validator.Any().constructor.name.should.equal('ANY');
    validator.Array().constructor.name.should.equal('ARRAY');
    validator.Boolean().constructor.name.should.equal('BOOLEAN');
    validator.Date().constructor.name.should.equal('DATE');
    validator.Function().constructor.name.should.equal('Function');
    validator.Integer().constructor.name.should.equal('INTEGER');
    validator.Number().constructor.name.should.equal('NUMBER');
    validator.Object().constructor.name.should.equal('OBJECT');
    validator.Regex().constructor.name.should.equal('REGEX');
    validator.String().constructor.name.should.equal('STRING');
  });

  it('duplicate custom type should fail', async () => {
    const validator = Validator();
    const type = validator.Any();

    validator.addType('test', type);

    (() => validator.addType('test', type)).should.throw(
      'Validator configuration error: Cannot add custom type. Name test is already set.'
    );
  });

  it('invalid custom type should fail', async () => {
    (() => Validator().addType('test', {})).should.throw(
      'Validator configuration error: Cannot add custom type test. Invalid type Object.'
    );
  });

  it('unknown custom type should fail', async () => {
    (() => Validator().Custom('test')).should.throw(
      'Validator configuration error: Error getting custom type test. Unknown type.'
    );
  });

  it('valid custom type should verify', () => {
    const validator = Validator();
    const type = validator.Any();

    validator.addType('test', type);
    validator.Custom('test').should.deep.equal(type);
  });

  it('unknown schema should throw', async () => {
    (() => Validator().Custom('test')).should.throw(
      'Validator configuration error: Error getting custom type test. Unknown type.'
    );
  });

  it('invalid schema should throw', async () => {
    await Validator()
      .validate(null, {})
      .should.be.rejectedWith('Validator configuration error: Invalid schema.');
  });

  it('invalid data should fail', async () => {
    const validator = Validator();

    await Validator()
      .validate(validator.Any(), null)
      .should.be.rejectedWith(
        'Bad Request. Input parameters and/or values are wrong.'
      );
  });

  it('valid data and schema should verify', async () => {
    const validator = Validator();

    await validator
      .validate(validator.Any(), true)
      .should.eventually.equal(true);
  });
});
