const _ = require('lodash');
const TYPES = require('./types');
const ValidationError = require('./error');

const DEFAULT_OPTIONS = {
  requiredAsDefault: true,
  throwValidationErrors: true,
  noEmptyStrings: true,
  noEmptyArrays: true,
  noEmptyObjects: true
}

const ALLOWED_TYPES = ['ARRAY', 'BOOLEAN', 'ENUM', 'FUNCTION', 'NUMBER', 'OBJECT', 'REGEX', 'SCHEMA', 'STRING'];

var _options = Symbol();
var _customs = Symbol();

class Validator {
  constructor(options) {
    this[_customs] = {};
    this[_options] = {}

    if (options) {
      for (const key in options) {
        this[_options][key] = options[key];
      }
      for (const key in DEFAULT_OPTIONS) {
        if (!_.has(this[_options], key)) this[_options][key] = DEFAULT_OPTIONS[key];
      }
    } else {
      for (const key in DEFAULT_OPTIONS) {
        this[_options][key] = DEFAULT_OPTIONS[key];
      }
    }
  }

  getOptions() {
    return this[_options];
  }

  addType(name, type) {
    if (_.has(this[_customs], name)) {
      throw new Error(`Identifier ${name} already set.`);
    }

    if (ALLOWED_TYPES.indexOf(type.constructor.name) === -1) {
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

  async isValid(schema, data, options = {}) {
    try {
      options = this.getOptions(options);

      const valid = await schema.isValid(data, options);
      if (!valid) {
        this.errorMessage = schema.errorMessage;
        if (options.throwValidationErrors) {
          throw new ValidationError('Bad Request. Input parameters and/or values are wrong.', this.errorMessage);
        }
        return false;
      } else {
        delete this.errorMessage;
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}

function ValidatorFactory(options) {
  return new Validator(options);
}

module.exports = ValidatorFactory;