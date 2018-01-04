const assert = require('assert');
const should = require('should');
const helper = require('./types/helper');
const Validator = require('../src/validator');

const DEFAULT_OPTIONS = {
  requiredAsDefault: true,
  throwValidationErrors: true,
  noEmptyStrings: true,
  noEmptyArrays: true,
  noEmptyObjects: true
}

const OVERWRITE_OPTIONS = {
  requiredAsDefault: false,
  throwValidationErrors: false,
  noEmptyStrings: false,
  noEmptyArrays: false,
  noEmptyObjects: false
}

describe('Validator()', function () {
  it('all types should be created with the validator', () => {
    const VALIDATOR = Validator();
    VALIDATOR.Array().constructor.name.should.equal('ARRAY');
    VALIDATOR.Boolean().constructor.name.should.equal('BOOLEAN');
    VALIDATOR.Enum([]).constructor.name.should.equal('ENUM');
    VALIDATOR.Function(function () {}).constructor.name.should.equal('FUNCTION');
    VALIDATOR.Integer().constructor.name.should.equal('INTEGER');
    VALIDATOR.Number().constructor.name.should.equal('NUMBER');
    VALIDATOR.Object({}).constructor.name.should.equal('OBJECT');
    VALIDATOR.Regex(/A-Z/).constructor.name.should.equal('REGEX');
    VALIDATOR.String().constructor.name.should.equal('STRING');
  });

  it('default options should get set', () => {
    const VALIDATOR = Validator();
    VALIDATOR.getOptions().should.eql(DEFAULT_OPTIONS);
  });

  it('options should be overwritten', () => {
    Validator(OVERWRITE_OPTIONS).getOptions().should.eql(OVERWRITE_OPTIONS);
    Validator({
      requiredAsDefault: false
    }).getOptions().should.eql({
      requiredAsDefault: false,
      throwValidationErrors: true,
      noEmptyStrings: true,
      noEmptyArrays: true,
      noEmptyObjects: true
    });
  });

  it('duplicate custom type should fail', () => {
    const VALIDATOR = Validator();
    const type = VALIDATOR.Boolean();

    VALIDATOR.addType('test', type);

    (() => {
      VALIDATOR.addType('test', type);
    }).should.throw('Identifier test already set.');
  });

  it('invalid custom type should fail', () => {
    (() => {
      Validator().addType('test', {});
    }).should.throw('Unknown type.');
  });

  it('unknown custom type should fail', () => {
    (() => {
      Validator().Custom('test');
    }).should.throw('Unknown custom type.');
  });

  it('valid custom type should verify', () => {
    const VALIDATOR = Validator();
    const type = VALIDATOR.Boolean();

    VALIDATOR.addType('test', type);

    VALIDATOR.Custom('test').should.equal(type);
  });

  it('invalid schema should throw', helper.mochaAsync(async() => {
    try {
      await Validator().isValid(null, {});
      should.equal(true, false, 'Did not throw error.');
    } catch (err) {
      err.message.should.equal('Cannot read property \'isValid\' of null');
    }
  }));

  it('invalid data should fail', helper.mochaAsync(async() => {
    const VALIDATOR = Validator();

    try {
      await VALIDATOR.isValid(VALIDATOR.Boolean(), 'true');
      should.equal(true, false, 'Did not throw error.');
    } catch (err) {
      err.name.should.equal('ValidationError');
      err.message.should.equal('Bad Request. Input parameters and/or values are wrong.');
      err.details.should.equal('Must be boolean but is string.');
    }
  }));

  it('valid data and schema should verify', helper.mochaAsync(async() => {
    const VALIDATOR = Validator();

    const result = await VALIDATOR.isValid(VALIDATOR.Boolean(), true);
    result.should.be.ok();
  }));

  it('should not throw', helper.mochaAsync(async() => {
    const VALIDATOR = Validator({
      throwValidationErrors: false
    });

    const result = await VALIDATOR.isValid(VALIDATOR.Boolean(), 'true');
    result.should.be.false();
    VALIDATOR.errorMessage.should.equal('Must be boolean but is string.');
  }));
});