const _ = require('lodash');
const BASE = require('./base');

var _regex = Symbol();
var _options = Symbol();
var _minLength = Symbol();
var _maxLength = Symbol();
var _exactLength = Symbol();

class REGEX extends BASE {
  constructor(regex, options) {
    super();
    if (!_.isRegExp(regex)) throw new Error('Invalid regular expression')
    this[_regex] = regex;
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

    if (!value.match(this[_regex])) {
      throw `Value does not match regular expression.`;
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

function RegexFactory(regex, options) {
  return new REGEX(regex, options);
}
module.exports = RegexFactory;
