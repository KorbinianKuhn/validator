const _ = require('lodash');
const BASE = require('./base');

var _minLength = Symbol();
var _maxLength = Symbol();
var _exactLength = Symbol();

class STRING extends BASE {
  constructor(options) {
    super(options);
  }

  async isValid(value, options = {}) {
    options = this.getOptions(options);

    if (this.isRequired(options) && _.isNil(value)) {
      this.errorMessage = `Required but is ${value}.`;
      return false;
    }

    if (!_.isString(value)) {
      this.errorMessage = `Must be string but is ${typeof value}.`;
      return false;
    }

    if (options.noEmptyStrings && value === '') {
      this.errorMessage = `String is empty.`;
      return false;
    }

    if (this[_minLength] && value.length < this[_minLength]) {
      this.errorMessage = `Must have at least ${this[_minLength]} characters.`;
      return false;
    }

    if (this[_maxLength] && value.length > this[_maxLength]) {
      this.errorMessage = `Must have at most ${this[_maxLength]} characters.`;
      return false;
    }

    if (this[_exactLength] && value.length !== this[_exactLength]) {
      this.errorMessage = `Must have exactly ${this[_exactLength]} characters.`;
      return false;
    }

    return true;
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