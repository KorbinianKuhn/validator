const { Validator } = require('./../default/validator');
const { VALIDATOR_OPTIONS, TYPES } = require('./options');
const { AnyFactory } = require('./types/any');
const { ArrayFactory } = require('./types/array');
const { BooleanFactory } = require('./types/boolean');
const { DateFactory } = require('./types/date');
const { NumberFactory } = require('./types/number');
const { ObjectFactory } = require('./types/object');
const { StringFactory } = require('./types/string');

class AngularValidator extends Validator {
  constructor(options) {
    super({ ...VALIDATOR_OPTIONS, ...options });
    this._types = TYPES;
  }

  Any(options = {}) {
    return AnyFactory(options, this._options);
  }

  Array(type, options = {}) {
    return ArrayFactory(type, options, this._options);
  }

  Boolean(options = {}) {
    return BooleanFactory(options, this._options);
  }

  Date(options = {}) {
    return DateFactory(options, this._options);
  }

  Number(options = {}) {
    return NumberFactory(options, this._options);
  }

  Object(schema, options = {}) {
    return ObjectFactory(schema, options, this._options);
  }

  String(options = {}) {
    return StringFactory(options, this._options);
  }
}

exports.AngularValidator = AngularValidator;
exports.AngularValidatorFactory = (options = {}) =>
  new AngularValidator(options);
