const _ = require('lodash');
const BASE = require('./base');

var _private = Symbol();

class STRING extends BASE {
  constructor(options) {
    super();
    this[_private] = {}
    this[_private].options = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_private].options, options);

    if (_.isNil(value)) {
      if (this[_private].default) return this[_private].default;
      if (this.isRequired(options)) throw `Required but is ${value}.`;
      return value;
    }

    if (!_.isString(value)) {
      throw `Must be string but is ${typeof value}.`;
    }

    if (this[_private].trim || (this[_private].trim === undefined && options.trimStrings)) {
      value = value.trim();
    }

    if (value === '' && (this[_private].empty === false || (this[_private].empty === undefined && options.noEmptyStrings))) {
      throw `String is empty.`;
    }

    if (this[_private].min && value.length < this[_private].min) {
      throw `Must have at least ${this[_private].min} characters.`;
    }

    if (this[_private].max && value.length > this[_private].max) {
      throw `Must have at most ${this[_private].max} characters.`;
    }

    if (this[_private].length && value.length !== this[_private].length) {
      throw `Must have exactly ${this[_private].length} characters.`;
    }

    return value;
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

  trim(boolean) {
    this[_private].trim = boolean;
    return this;
  }

  default (value) {
    if (!_.isString(value)) {
      throw new Error('Must be string.');
    }
    this[_private].default = value;
    return this;
  }

  // Deprecated remove in v1
  defaultValue(value) {
    console.log('express-input-validator: using defaultValue() is deprecated. Use default() instead.');
    return this.default(value);
  }

  minLength(length) {
    console.log('express-input-validator: using minLength() is deprecated. Use min() instead.');
    return this.min(length);
  }

  maxLength(length) {
    console.log('express-input-validator: using maxLength() is deprecated. Use max() instead.');
    return this.max(length);
  }

  exactLength(length) {
    console.log('express-input-validator: using exactLength() is deprecated. Use length() instead.');
    return this.length(length);
  }
}

function StringFactory(options) {
  return new STRING(options);
}
module.exports = StringFactory;
