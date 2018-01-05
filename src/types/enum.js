const _ = require('lodash');
const BASE = require('./base');

var _values = Symbol();
var _options = Symbol();
var _default = Symbol();

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

    if (_.isNil(value)) {
      if (this[_default]) return this[_default];
      if (this.isRequired(options)) throw `Required but is ${value}.`;
      return value;
    }

    if (this[_values].indexOf(value) === -1) {
      throw `'${value}' is not one of [${this[_values].toString()}].`;
    }

    return value;
  }

  defaultValue(value) {
    this[_default] = value;
    return this;
  }
}

function NewEnum(values, options) {
  return new ENUM(values, options);
}
module.exports = NewEnum;
