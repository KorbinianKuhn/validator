const _ = require('lodash');
const { TYPES, TYPE_NAMES } = require('./../types');
const ValidationError = require('./../error');
const defaults = require('./../defaults');

class Validator {
  constructor(options) {
    this._options = _.defaults(options, defaults.VALIDATOR_OPTIONS);
    this._customs = {};
    this._types = TYPE_NAMES;
  }

  async validate(schema, data) {
    if (!_.hasIn(schema, 'constructor.name')) {
      throw new Error('Invalid schema.');
    }

    if (this._types.indexOf(schema.constructor.name) === -1) {
      throw new Error('Unknown schema.');
    }

    try {
      return await schema.validate(data);
    } catch (err) {
      const error = new ValidationError(
        'Bad Request. Input parameters and/or values are wrong.',
        err
      );
      if (this._options.throwValidationErrors) {
        throw error;
      } else {
        return error;
      }
    }
  }

  addType(name, type) {
    if (_.has(this._customs, name)) {
      throw new Error(
        `Error adding custom type. Name '${name}' is already set.`
      );
    }

    if (this._types.indexOf(type.constructor.name) === -1) {
      throw new Error(
        `Error adding custom type '${name}'. Unknown type '${
          type.constructor.name
        }'.`
      );
    }

    this._customs[name] = _.cloneDeep(type);
  }

  Custom(name) {
    if (!_.has(this._customs, name)) {
      throw new Error(`Error getting custom type '${name}'. Unknown type.`);
    } else {
      return _.cloneDeep(this._customs[name]);
    }
  }

  Any(type, options = {}) {
    return TYPES.Any(options, this._options);
  }

  Array(type, options = {}) {
    return TYPES.Array(type, options, this._options);
  }

  Boolean(options = {}) {
    return TYPES.Boolean(options, this._options);
  }

  Date(options = {}) {
    return TYPES.Date(options, this._options);
  }

  Enum(values, options = {}) {
    return TYPES.Enum(values, options, this._options);
  }

  Function(func, options = {}) {
    return TYPES.Function(func, options, this._options);
  }

  Integer(options = {}) {
    return TYPES.Integer(options, this._options);
  }

  Number(options = {}) {
    return TYPES.Number(options, this._options);
  }

  Object(schema, options = {}) {
    return TYPES.Object(schema, options, this._options);
  }

  Regex(regex, options = {}) {
    return TYPES.Regex(regex, options, this._options);
  }

  String(options = {}) {
    return TYPES.String(options, this._options);
  }
}

exports.Validator = Validator;
exports.ValidatorFactory = (options = {}) => new Validator(options);
