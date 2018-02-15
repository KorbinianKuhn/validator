const _ = require('lodash');
const BASE = require('./base');
const helper = require('../helper');
const message = require('../message');

const _private = Symbol('Private variables');

const validateArray = async (value, privates, options) => {
  if (_.isNil(value)) {
    if (privates.default) return privates.default;
    if (privates.required) throw message.required(options.language, options.type, value);
    return value;
  }

  if (options.parseToType && _.isString(value)) {
    try {
      value = JSON.parse(value);
    } catch (err) {
      value = value.split(',');
    }
  }

  if (!_.isArray(value)) throw message.wrongType(options.language, options.type, 'array', typeof value);

  if (value.length === 0 && (privates.empty === false || (privates.empty === undefined && options.noEmptyArrays))) {
    throw message.get(options.language, options.type, 'array', 'empty');
  }

  if (privates.min && value.length < privates.min) {
    throw message.get(options.language, options.type, 'array', 'min', privates.min);
  }

  if (privates.max && value.length > privates.max) {
    throw message.get(options.language, options.type, 'array', 'max', privates.max);
  }

  if (privates.length && value.length !== privates.length) {
    throw message.get(options.language, options.type, 'array', 'length', privates.length);
  }

  if (privates.unique && _.uniqWith(value, _.isEqual).length !== value.length) {
    throw message.get(options.language, options.type, 'array', 'unique');
  }

  if (privates.type !== undefined) {
    const errors = {};

    for (const index in value) {
      try {
        value[index] = await privates.type.validate(value[index], options);
      } catch (err) {
        errors[index] = err;
      }
    }

    if (_.keys(errors).length > 0) {
      throw errors;
    } else {
      return value;
    }
  } else {
    return value;
  }
};

class ARRAY extends BASE {
  constructor(type, options) {
    super();
    this[_private] = {};
    this[_private].type = type;
    this[_private].options = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_private].options, options);

    const func = validateArray(value, {
      required: this.isRequired(options),
      default: this[_private].default,
      empty: this[_private].empty,
      min: this[_private].min,
      max: this[_private].max,
      length: this[_private].length,
      unique: this[_private].unique,
      type: this[_private].type,
    }, options);

    return helper.validate(options.type, func);
  }

  min(length) {
    this[_private].min = length;
    return this;
  }

  max(length) {
    this[_private].max = length;
    return this;
  }

  length(length) {
    this[_private].length = length;
    return this;
  }

  empty(boolean) {
    this[_private].empty = boolean;
    return this;
  }

  default(value) {
    if (!_.isArray(value)) {
      throw new Error('Must be array.');
    }
    this[_private].default = value;
    return this;
  }

  unique(boolean) {
    this[_private].unique = boolean;
    return this;
  }
}

function ArrayFactory(type, options) {
  return new ARRAY(type, options);
}
module.exports = ArrayFactory;
