const _ = require('lodash');
const BASE = require('./base');

var _private = Symbol();

class ENUM extends BASE {
  constructor(values, options) {
    super();

    if (!values) {
      throw new Error('Missing values for enum.')
    }

    if (!_.isArray(values)) {
      throw new Error('Values must be an array.')
    }

    this[_private] = {};
    this[_private].values = values;
    this[_private].options = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_private].options, options);

    if (_.isNil(value)) {
      if (this[_private].default) return this[_private].default;
      if (this.isRequired(options)) throw `Required but is ${value}.`;
      return value;
    }

    if (this[_private].values.indexOf(value) === -1) {
      throw `'${value}' is not one of [${this[_private].values.toString()}].`;
    }

    return value;
  }

  default (value) {
    this[_private].default = value;
    return this;
  }

  // Deprecated remove in v1
  defaultValue(value) {
    console.log('using defaultValue() is deprecated. Use default() instead.');
    return this.default(value);
  }
}

function NewEnum(values, options) {
  return new ENUM(values, options);
}
module.exports = NewEnum;
