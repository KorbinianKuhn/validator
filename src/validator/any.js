const _ = require('lodash');
const TYPES = require('./../types');
const ValidationError = require('./../error');
const defaults = require('./../defaults');

class Validator {
  constructor(options) {
    this._options = _.defaults(options, defaults.VALIDATOR_OPTIONS);
    this._customs = {};
  }

  async validate(schema, data) {
    if (!_.hasIn(schema, 'constructor.name')) {
      throw new Error('Invalid schema.');
    }

    if (defaults.TYPE_NAMES.indexOf(schema.constructor.name) === -1) {
      throw new Error('Unknown schema.');
    }

    try {
      return await schema.validate(data);
    } catch (err) {
      const error = new ValidationError('Bad Request. Input parameters and/or values are wrong.', err);
      if (this._options.throwValidationErrors) {
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
    return TYPES.Any(options, _.pick(this._options, ...defaults.ANY_OPTION_KEYS));
  }

  Array(type, options = {}) {
    return TYPES.Array(type, options, _.pick(this._options, ...defaults.ARRAY_OPTION_KEYS));
  }

  Boolean(options = {}) {
    return TYPES.Boolean(options, _.pick(this._options, ...defaults.BOOLEAN_OPTION_KEYS));
  }

  Date(options = {}) {
    return TYPES.Date(options, _.pick(this._options, ...defaults.DATE_OPTION_KEYS));
  }

  Enum(values, options = {}) {
    return TYPES.Enum(values, options, _.pick(this._options, ...defaults.ENUM_OPTION_KEYS));
  }

  Function(func, options = {}) {
    return TYPES.Function(func, options, _.pick(this._options, ...defaults.FUNCTION_OPTION_KEYS));
  }

  Integer(options = {}) {
    return TYPES.Integer(options, _.pick(this._options, ...defaults.INTEGER_OPTION_KEYS));
  }

  Number(options = {}) {
    return TYPES.Number(options, _.pick(this._options, ...defaults.NUMBER_OPTION_KEYS));
  }

  Object(schema, options = {}) {
    return TYPES.Object(schema, options, _.pick(this._options, ...defaults.OBJECT_OPTION_KEYS));
  }

  Regex(regex, options = {}) {
    return TYPES.Regex(regex, options, _.pick(this._options, ...defaults.REGEX_OPTION_KEYS));
  }

  String(options = {}) {
    return TYPES.String(options, _.pick(this._options, ...defaults.STRING_OPTION_KEYS));
  }
}

exports.Validator = Validator;
exports.ValidatorFactory = (options = {}) => new Validator(options);
