const _ = require('lodash');
const BASE = require('./base');
const message = require('../message');
const helper = require('../helper');

const _private = Symbol('Private variables.');

const validateFunction = async (value, privates, options) => {
  if (_.isNil(value)) {
    if (privates.default) return privates.default;
    if (privates.required) throw message.required(options.language, options.type, value);
    return value;
  }

  try {
    return await privates.func(value, options);
  } catch (err) {
    throw err.message;
  }
};

class FUNCTION extends BASE {
  constructor(func, options) {
    super();
    if (func === undefined) {
      throw new Error('Missing function.');
    }

    if (!_.isFunction(func)) {
      throw new Error('Not a function.');
    }

    this[_private] = {};
    this[_private].func = func;
    this[_private].options = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_private].options, options);

    options = _.defaults(this[_private].options, options);
    const func = validateFunction(value, {
      required: this.isRequired(options),
      default: this[_private].default,
      func: this[_private].func
    }, options);

    return helper.validate(options.type, func);
  }

  default(value) {
    this[_private].default = value;
    return this;
  }

  toObject() {
    const object = {
      type: 'function',
      required: this.isRequired(this[_private].options),
      description: 'Function is not implemented yet.'
    };

    return object;
  }
}

function FunctionFactory(func, options) {
  return new FUNCTION(func, options);
}
module.exports = FunctionFactory;
