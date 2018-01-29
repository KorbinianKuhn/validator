const _ = require('lodash');
const BASE = require('./base');

var _private = Symbol();

class NUMBER extends BASE {
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

    if (options.parseToType && _.isString(value)) {
      if (value.match(/^[-/+]?\d+(\.\d+)?$/)) value = parseFloat(value);
    }

    if (!_.isNumber(value)) {
      throw `Must be number but is ${typeof value}.`;
    }

    if (this[_private].min && value < this[_private].min) {
      throw `Must be at minimum ${this[_private].min}.`;
    }

    if (this[_private].max && value > this[_private].max) {
      throw `Must be at maximum ${this[_private].max}.`;
    }

    if (this[_private].less && value >= this[_private].less) {
      throw `Must be less than ${this[_private].less}.`;
    }

    if (this[_private].greater && value <= this[_private].greater) {
      throw `Must be greater than ${this[_private].greater}.`;
    }

    if (this[_private].positive && value <= 0) {
      throw `Must be positive.`;
    }

    if (this[_private].negative && value >= 0) {
      throw `Must be negative.`;
    }

    return value;
  }

  min(value) {
    this[_private].min = value;
    return this;
  }

  max(value) {
    this[_private].max = value;
    return this;
  }

  less(value) {
    this[_private].less = value;
    return this;
  }

  greater(value) {
    this[_private].greater = value;
    return this;
  }

  positive() {
    this[_private].positive = true;
    return this;
  }

  negative() {
    this[_private].negative = true;
    return this;
  }

  default (value) {
    if (!_.isNumber(value)) {
      throw new Error('Must be number.');
    }
    this[_private].default = value;
    return this;
  }

  // Deprecated remove in v1
  defaultValue(value) {
    console.log('express-input-validator: using defaultValue() is deprecated. Use default() instead.');
    return this.default(value);
  }

}

function NumberFactory(options) {
  return new NUMBER(options);
}
module.exports = NumberFactory;
