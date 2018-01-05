const _ = require('lodash');
const BASE = require('./base');

var _options = Symbol();
var _min = Symbol();
var _max = Symbol();
var _default = Symbol();

class INTEGER extends BASE {
  constructor(options) {
    super();
    this[_options] = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_options], options);

    if (_.isNil(value)) {
      if (this[_default]) return this[_default];
      if (this.isRequired(options)) throw `Required but is ${value}.`;
      return value;
    }

    if (options.parseToType && _.isString(value)) {
      if (value.match(/^[+\-]?\d+$/)) value = parseInt(value);
    }

    if (!_.isInteger(value)) {
      throw `Must be integer but is ${typeof value}.`;
    }

    if (this[_min] && value < this[_min]) {
      throw `Must be at minimum ${this[_min]}.`;
    }

    if (this[_max] && value > this[_max]) {
      throw `Must be at maximum ${this[_max]}.`;
    }

    return value;
  }

  min(value) {
    this[_min] = value;
    return this;
  }

  max(value) {
    this[_max] = value;
    return this;
  }

  defaultValue(value) {
    if (!_.isInteger(value)) {
      throw new Error('Must be integer.');
    }
    this[_default] = value;
    return this;
  }
}

function IntegerFactory(options) {
  return new INTEGER(options);
}
module.exports = IntegerFactory;
