const _ = require('lodash');
const BASE = require('./base');

var _private = Symbol();

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

    if (_.isNil(value)) {
      if (this[_private].default) return this[_private].default;
      if (this.isRequired(options)) throw `Required but is ${value}.`;
      return value;
    }

    try {
      return await this[_private].func(value, options);
    } catch (err) {
      throw err.message;
    }
  }

  default (value) {
    this[_private].default = value;
    return this;
  }

  // Deprecated remove in v1
  defaultValue(value) {
    console.log('express-input-validator: using defaultValue() is deprecated. Use default() instead.');
    return this.default(value);
  }
}

function FunctionFactory(func, options) {
  return new FUNCTION(func, options);
}
module.exports = FunctionFactory;
