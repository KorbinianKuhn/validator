const should = require('should');
const helper = require('./../helper');
const Validator = require('./../../index').Validator;
const defaults = require('../../src/defaults');

const OVERWRITE_OPTIONS = {
  type: 'angular',
  language: 'de',
  requiredAsDefault: false,
  throwValidationErrors: false,
  parseToType: true,
  noEmptyStrings: false,
  trimStrings: false,
  noEmptyArrays: false,
  noEmptyObjects: false,
  noUndefinedKeys: false,
  dateFormat: 'YYYY-MM-DD',
  utc: false,
  strictDateValidation: false
};

describe('Validator()', () => {
  it('constructor()', () => {
    const validator = Validator();
    validator._options.type.should.equal('any');
    validator._options.messages.should.equal('default');
  });

  it('all types should be created with the validator', () => {
    const validator = Validator();
    validator.Any().constructor.name.should.equal('ANY');
    validator.Array().constructor.name.should.equal('ARRAY');
    validator.Boolean().constructor.name.should.equal('BOOLEAN');
    validator.Date().constructor.name.should.equal('DATE');
    validator.Enum([]).constructor.name.should.equal('ENUM');
    validator.Function(() => {}).constructor.name.should.equal('FUNCTION');
    validator.Integer().constructor.name.should.equal('INTEGER');
    validator.Number().constructor.name.should.equal('NUMBER');
    validator.Object({}).constructor.name.should.equal('OBJECT');
    validator.Regex(/A-Z/).constructor.name.should.equal('REGEX');
    validator.String().constructor.name.should.equal('STRING');
  });

  it('default options should be set', () => {
    const validator = Validator();
    validator._options.should.eql(defaults.VALIDATOR_OPTIONS);
  });

  it('overwrite options should be set', () => {
    const validator = Validator(OVERWRITE_OPTIONS);
    validator._options.should.eql(OVERWRITE_OPTIONS);
  });

  it('mixed options should be set', () => {
    const validator = Validator({
      requiredAsDefault: false
    });
    validator._options.should.eql({
      type: 'any',
      language: 'en',
      messages: 'default',
      requiredAsDefault: false,
      throwValidationErrors: true,
      parseToType: false,
      noEmptyStrings: true,
      trimStrings: true,
      noEmptyArrays: true,
      noEmptyObjects: true,
      noUndefinedKeys: true,
      dateFormat: defaults.DATE_FORMAT,
      parseDates: true,
      utc: true,
      strictDateValidation: true
    });
  });

  it('duplicate custom type should fail', async () => {
    const validator = Validator();
    const type = validator.Boolean();

    validator.addType('test', type);

    await helper.throw(() => validator.addType('test', type), 'Identifier test already set.');
  });

  it('invalid custom type should fail', async () => {
    await helper.throw(() => Validator().addType('test', {}), 'Unknown type.');
  });

  it('unknown custom type should fail', async () => {
    await helper.throw(() => Validator().Custom('test'), 'Unknown custom type.');
  });

  it('valid custom type should verify', () => {
    const validator = Validator();
    const type = validator.Boolean();

    validator.addType('test', type);

    validator.Custom('test').should.deepEqual(type);
  });

  it('unknown schema should throw', async () => {
    const schema = {
      constructor: {
        name: 'unknown'
      }
    };
    await helper.throw(Validator().validate({}, {}), 'Unknown schema.');
  });

  it('invalid schema should throw', async () => {
    await helper.throw(Validator().validate(null, {}), 'Invalid schema.');
  });

  it('invalid data should fail', async () => {
    const validator = Validator();

    try {
      await validator.validate(validator.Boolean(), 'true');
      should.equal(true, false, 'Did not throw error.');
    } catch (err) {
      err.name.should.equal('ExpressInputValidationError');
      err.message.should.equal('Bad Request. Input parameters and/or values are wrong.');
      err.details.should.equal('Must be boolean but is string.');
    }
  });

  it('valid data and schema should verify', async () => {
    const validator = Validator();

    const value = await validator.validate(validator.Boolean(), true);
    value.should.equal(true);
  });

  it('should not throw', async () => {
    const validator = Validator({
      throwValidationErrors: false
    });

    const err = await validator.validate(validator.Boolean(), 'true');
    err.details.should.equal('Must be boolean but is string.');
  });
});
