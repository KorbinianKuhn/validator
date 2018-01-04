const _ = require('lodash');
const BASE = require('./base');

var _func = Symbol();
var _options = Symbol();

class FUNCTION extends BASE {
  constructor(func, options) {
    super();
    if (func === undefined) {
      throw new Error('Missing function.');
    }

    if (!_.isFunction(func)) {
      throw new Error('Not a function.');
    }

    this[_func] = func;
    this[_options] = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_options], options);

    if (this.isRequired(options) && _.isNil(value)) {
      throw `Required but is ${value}.`;
    }

    try {
      return await this[_func](value, options);
    } catch (err) {
      throw err.message;
    }
  }
}

function FunctionFactory(func, options) {
  return new FUNCTION(func, options);
}
module.exports = FunctionFactory;
