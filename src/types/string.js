const _ = require('lodash');
const BASE = require('./base');

var _options = Symbol();
var _minLength = Symbol();
var _maxLength = Symbol();
var _exactLength = Symbol();

class STRING extends BASE {
  constructor(options) {
    super();
    this[_options] = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_options], options);

    if (this.isRequired(options) && _.isNil(value)) {
      throw `Required but is ${value}.`;
    }

    if (!_.isString(value)) {
      throw `Must be string but is ${typeof value}.`;
    }

    if (options.noEmptyStrings && value === '') {
      throw `String is empty.`;
    }

    if (this[_minLength] && value.length < this[_minLength]) {
      throw `Must have at least ${this[_minLength]} characters.`;
    }

    if (this[_maxLength] && value.length > this[_maxLength]) {
      throw `Must have at most ${this[_maxLength]} characters.`;
    }

    if (this[_exactLength] && value.length !== this[_exactLength]) {
      throw `Must have exactly ${this[_exactLength]} characters.`;
    }

    return value;
  }

  minLength(length) {
    this[_minLength] = length;
    return this;
  }

  maxLength(length) {
    this[_maxLength] = length;
    return this;
  }

  exactLength(length) {
    this[_exactLength] = length;
    return this;
  }
}

function StringFactory(options) {
  return new STRING(options);
}
module.exports = StringFactory;
