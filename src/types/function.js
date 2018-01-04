const _ = require('lodash');
const BASE = require('./base');

var _func = Symbol();

class FUNCTION extends BASE {
  constructor(func, options) {
    super(options);
    if (func === undefined) {
      throw new Error('Missing function.');
    }

    if (!_.isFunction(func)) {
      throw new Error('Not a function.');
    }

    this[_func] = func;
  }

  async isValid(value, options = {}) {
    options = this.getOptions(options);

    if (this.isRequired(options) && _.isNil(value)) {
      this.errorMessage = `Required but is ${value}.`;
      return false;
    }

    try {
      await this[_func](value, options);
      return true;
    } catch (err) {
      this.errorMessage = err.message;
      return false;
    }
  }
}

function FunctionFactory(func, options) {
  return new FUNCTION(func, options);
}
module.exports = FunctionFactory;