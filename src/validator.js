const _ = require('lodash');
const TYPES = require('./types');
const ValidationError = require('./error');
const defaults = require('./defaults');

var _options = Symbol();
var _customs = Symbol();

class Validator {
  constructor(options) {
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

    this[_customs][name] = type;
  }

  Custom(name) {
    if (!_.has(this[_customs], name)) {
      throw new Error('Unknown custom type.');
    } else {
      return this[_customs][name];
    }
  }

  Array(type, options) {
    return TYPES.Array(type, options);
  }

  Boolean(options) {
    return TYPES.Boolean(options);
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

function ValidatorFactory(options) {
  return new Validator(options);
}

module.exports = ValidatorFactory;
