const _ = require('lodash');
const BASE = require('./base');

var _regex = Symbol();
var _minLength = Symbol();
var _maxLength = Symbol();
var _exactLength = Symbol();

class REGEX extends BASE {
  constructor(regex, options) {
    super(options);
    if (!_.isRegExp(regex)) throw new Error('Invalid regular expression')
    this[_regex] = regex;
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

    if (!value.match(this[_regex])) {
      this.errorMessage = `Value does not match regular expression.`;
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

function RegexFactory(regex, options) {
  return new REGEX(regex, options);
}
module.exports = RegexFactory;