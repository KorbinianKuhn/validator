const _ = require('lodash');
const BASE = require('./base');

var _values = Symbol();
var _options = Symbol();

class ENUM extends BASE {
  constructor(values, options) {
    super();

    if (!values) {
      throw new Error('Missing values for enum.')
    }

    if (!_.isArray(values)) {
      throw new Error('Values must be an array.')
    }

    this[_values] = values;
    this[_options] = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_options], options);

    if (this.isRequired(options) && _.isNil(value)) {
      throw `Required but is ${value}.`;
    }

    if (this[_values].indexOf(value) === -1) {
      throw `'${value}' is not one of [${this[_values].toString()}].`;
    }

    return value;
  }
}

function NewEnum(values, options) {
  return new ENUM(values, options);
}
module.exports = NewEnum;
