const _ = require('lodash');
const BASE = require('./base');

var _values = Symbol();

class ENUM extends BASE {
  constructor(values, options) {
    super(options);

    if (!values) {
      throw new Error('Missing values for enum.')
    }

    if (!_.isArray(values)) {
      throw new Error('Values must be an array.')
    }

    this[_values] = values;
  }

  async isValid(value, options = {}) {
    options = this.getOptions(options);

    if (this.isRequired(options) && _.isNil(value)) {
      this.errorMessage = `Required but is ${value}.`;
      return false;
    }

    if (this[_values].indexOf(value) === -1) {
      this.errorMessage = `'${value}' is not one of [${this[_values].toString()}].`;
      return false;
    }

    return true;
  }
}

function NewEnum(values, options) {
  return new ENUM(values, options);
}
module.exports = NewEnum;