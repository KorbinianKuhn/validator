const _ = require('lodash');
const TYPES = require('./../types');
const ValidationError = require('./../error');
const defaults = require('./../defaults');

const _options = Symbol('Private options');
const _customs = Symbol('Custom types');

class Validator {
  constructor(options = {}) {
    this[_customs] = {};
    this[_options] = _.defaults(options, defaults.VALIDATOR_OPTIONS);
  }

  getOptions() {
    return this[_options];
  }

  addType(name, type) {
    if (_.has(this[_customs], name)) {
      throw new Error(`Identifier ${name} already set.`);
    }

    if (defaults.TYPE_NAMES.indexOf(type.constructor.name) === -1) {
      throw new Error('Unknown type.');
    }

    this[_customs][name] = _.cloneDeep(type);
  }

  Custom(name) {
    if (!_.has(this[_customs], name)) {
      throw new Error('Unknown custom type.');
    } else {
      return _.cloneDeep(this[_customs][name]);
    }
  }

  Array(type, options) {
    return TYPES.Array(type, options);
  }

  Boolean(options) {
    return TYPES.Boolean(_.defaults(options, this.getOptions()));
  }

  Date(options) {
    return TYPES.Date(options);
  }

  Enum(values, options) {
    return TYPES.Enum(values, options);
  }

  Function(func, options) {
    return TYPES.Function(func, options);
  }

  Integer(options) {
    return TYPES.Integer(options);
  }

  Number(options) {
    return TYPES.Number(options);
  }

  Object(options) {
    return TYPES.Object(options);
  }

  Regex(regex, options) {
    return TYPES.Regex(regex, options);
  }

  Request(options) {
    return TYPES.Request(options);
  }

  String(options) {
    return TYPES.String(options);
  }

  async validate(schema, data, options = {}) {
    options = _.defaults(options, this[_options]);

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
}

module.exports = Validator;
