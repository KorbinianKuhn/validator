const assert = require('assert');
const should = require('should');
const helper = require('./types/helper');
const Validator = require('../src/validator');
const defaults = require('../src/defaults');

const OVERWRITE_OPTIONS = {
  requiredAsDefault: false,
  throwValidationErrors: false,
  parseToType: true,
  noEmptyStrings: false,
  trimStrings: false,
  noEmptyArrays: false,
  noEmptyObjects: false,
  dateFormat: 'YYYY-MM-DD'
}

describe('Validator()', function () {
  it('all types should be created with the validator', () => {
    const VALIDATOR = Validator();
    VALIDATOR.Array().constructor.name.should.equal('ARRAY');
    VALIDATOR.Boolean().constructor.name.should.equal('BOOLEAN');
    VALIDATOR.Date().constructor.name.should.equal('DATE');
    VALIDATOR.Enum([]).constructor.name.should.equal('ENUM');
    VALIDATOR.Function(function () {}).constructor.name.should.equal('FUNCTION');
    VALIDATOR.Integer().constructor.name.should.equal('INTEGER');
    VALIDATOR.Number().constructor.name.should.equal('NUMBER');
    VALIDATOR.Object({}).constructor.name.should.equal('OBJECT');
    VALIDATOR.Regex(/A-Z/).constructor.name.should.equal('REGEX');
    VALIDATOR.Request().constructor.name.should.equal('REQUEST');
    VALIDATOR.String().constructor.name.should.equal('STRING');
  });

  it('default options should get set', () => {
    const VALIDATOR = Validator();
    VALIDATOR.getOptions().should.eql(defaults.VALIDATOR_OPTIONS);
  });

  it('options should be overwritten', () => {
    Validator(OVERWRITE_OPTIONS).getOptions().should.eql(OVERWRITE_OPTIONS);
    Validator({
      requiredAsDefault: false
    }).getOptions().should.eql({
      requiredAsDefault: false,
      throwValidationErrors: true,
      parseToType: false,
      noEmptyStrings: true,
      trimStrings: true,
      noEmptyArrays: true,
      noEmptyObjects: true,
      dateFormat: defaults.DATE_FORMAT,
      parseDates: true
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

    VALIDATOR.Custom('test').should.deepEqual(type);
  });

  it('unknown schema should throw', helper.mochaAsync(async() => {
    try {
      await Validator().validate({
        constructor: {
          name: 'unknown'
        }
      }, {});
      should.equal(true, false, 'Did not throw error.');
    } catch (err) {
      err.message.should.equal('Unknown schema.');
    }
  }));

  it('invalid schema should throw', helper.mochaAsync(async() => {
    try {
      await Validator().validate(null, {});
      should.equal(true, false, 'Did not throw error.');
    } catch (err) {
      err.message.should.equal('Invalid schema.');
    }
  }));

  it('invalid data should fail', helper.mochaAsync(async() => {
    const VALIDATOR = Validator();

    try {
      await VALIDATOR.validate(VALIDATOR.Boolean(), 'true');
      should.equal(true, false, 'Did not throw error.');
    } catch (err) {
      err.name.should.equal('ExpressInputValidationError');
      err.message.should.equal('Bad Request. Input parameters and/or values are wrong.');
      err.details.should.equal('Must be boolean but is string.');
    }
  }));

  it('valid data and schema should verify', helper.mochaAsync(async() => {
    const VALIDATOR = Validator();

    const value = await VALIDATOR.validate(VALIDATOR.Boolean(), true);
    value.should.equal(true);
  }));

  it('should not throw', helper.mochaAsync(async() => {
    const VALIDATOR = Validator({
      throwValidationErrors: false
    });

    const err = await VALIDATOR.validate(VALIDATOR.Boolean(), 'true');
    err.details.should.equal('Must be boolean but is string.');

  }));
});
