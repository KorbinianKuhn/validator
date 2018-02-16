const _ = require('lodash');
const TYPES = require('./../types');
const ValidationError = require('./../error');
const defaults = require('./../defaults');

const ANY_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationError'];
const ARRAY_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType', 'noEmptyArrays'];
const BOOLEAN_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType'];
const DATE_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType', 'dateFormat', 'parseDates', 'strictDateValidation', 'utc'];
const ENUM_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType'];
const FUNCTION_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors'];
const INTEGER_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType'];
const NUMBER_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType'];
const OBJECT_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType', 'noEmptyObjects', 'noUndefinedKeys'];
const REGEX_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType', 'noEmptyStrings', 'trimStrings'];
const STRING_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType', 'noEmptyStrings', 'trimStrings'];

class Validator {
  constructor(options) {
    this._options = _.defaults(options, defaults.VALIDATOR_OPTIONS);
    this._customs = {};
  }

  async validate(schema, data, options = {}) {
    options = _.defaults(options, this._options);

    if (!_.hasIn(schema, 'constructor.name')) {
      throw new Error('Invalid schema.');
    }

    if (defaults.TYPE_NAMES.indexOf(schema.constructor.name) === -1) {
      throw new Error('Unknown schema.');
    }

    try {
      return await schema.validate(data, options);
    } catch (err) {
      const error = new ValidationError('Bad Request. Input parameters and/or values are wrong.', err);
      if (options.throwValidationErrors) {
        throw error;
      } else {
        return error;
      }
    }
  }

  addType(name, type) {
    if (_.has(this._customs, name)) {
      throw new Error(`Identifier ${name} already set.`);
    }

    if (defaults.TYPE_NAMES.indexOf(type.constructor.name) === -1) {
      throw new Error('Unknown type.');
    }

    this._customs[name] = _.cloneDeep(type);
  }

  Custom(name) {
    if (!_.has(this._customs, name)) {
      throw new Error('Unknown custom type.');
    } else {
      return _.cloneDeep(this._customs[name]);
    }
  }

  Any(type, options = {}) {
    return TYPES.Any(_.defaults(options, _.pick(this._options, ...ANY_OPTION_KEYS)));
  }

  Array(type, options = {}) {
    return TYPES.Array(type, _.defaults(options, _.pick(this._options, ...ARRAY_OPTION_KEYS)));
  }

  Boolean(options = {}) {
    return TYPES.Boolean(_.defaults(options, _.pick(this._options, ...BOOLEAN_OPTION_KEYS)));
  }

  Date(options = {}) {
    return TYPES.Date(_.defaults(options, _.pick(this._options, ...DATE_OPTION_KEYS)));
  }

  Enum(values, options = {}) {
    return TYPES.Enum(values, _.defaults(options, _.pick(this._options, ...ENUM_OPTION_KEYS)));
  }

  Function(func, options = {}) {
    return TYPES.Function(func, _.defaults(options, _.pick(this._options, ...FUNCTION_OPTION_KEYS)));
  }

  Integer(options = {}) {
    return TYPES.Integer(_.defaults(options, _.pick(this._options, ...INTEGER_OPTION_KEYS)));
  }

  Number(options = {}) {
    return TYPES.Number(_.defaults(options, _.pick(this._options, ...NUMBER_OPTION_KEYS)));
  }

  Object(options = {}) {
    return TYPES.Object(_.defaults(options, _.pick(this._options, ...OBJECT_OPTION_KEYS)));
  }

  Regex(regex, options = {}) {
    return TYPES.Regex(regex, _.defaults(options, _.pick(this._options, ...REGEX_OPTION_KEYS)));
  }

  String(options = {}) {
    return TYPES.String(_.defaults(options, _.pick(this._options, ...STRING_OPTION_KEYS)));
  }
}

exports.Validator = Validator;
exports.ValidatorFactory = (options = {}) => new Validator(options);
