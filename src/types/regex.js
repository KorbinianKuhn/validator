const _ = require('lodash');
const BASE = require('./base');
const message = require('../message');
const helper = require('../helper');

const _private = Symbol('Private variables');

const validateRegex = async (value, privates, options) => {
  const language = options.language || 'en';
  if (_.isNil(value)) {
    if (privates.default) return privates.default;
    if (privates.required) throw message.required(options.language, options.type, value);
    return value;
  }

  if (!_.isString(value)) throw message.wrongType(options.language, options.type, 'string', typeof value);

  if (value === '' && privates.empty) {
    return value;
  }

  if (!value.match(privates.regex)) {
    throw privates.message[language];
  }

  if (privates.min && value.length < privates.min) throw message.get(options.language, options.type, 'regex', 'min', privates.min);
  if (privates.max && value.length > privates.max) throw message.get(options.language, options.type, 'regex', 'max', privates.max);
  if (privates.length && value.length !== privates.length) throw message.get(options.language, options.type, 'regex', 'length', privates.length);

  return value;
};

class REGEX extends BASE {
  constructor(regex, options) {
    super();
    if (!_.isRegExp(regex)) throw new Error('Invalid regular expression');
    this[_private] = {};
    this[_private].regex = regex;
    this[_private].options = options || {};
    this[_private].message = {
      en: message.get('en', this[_private].options.type, 'regex', 'invalid'),
      de: message.get('de', this[_private].options.type, 'regex', 'invalid'),
    };
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_private].options, options);

    const func = validateRegex(value, {
      required: this.isRequired(options),
      default: this[_private].default,
      empty: this[_private].empty,
      regex: this[_private].regex,
      min: this[_private].min,
      max: this[_private].max,
      length: this[_private].length,
      message: this[_private].message
    }, options);

    return helper.validate(options.type, func);
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

  message(text, language = 'en') {
    this[_private].message[language] = text;
    return this;
  }

  default(value) {
    if (!_.isString(value)) {
      throw new Error('Must be string.');
    }
    this[_private].default = value;
    return this;
  }

  toObject() {
    const object = {
      type: 'string',
      required: this.isRequired(this[_private].options),
      pattern: this[_private].regex
    };

    if (this.name()) object.displayName = this.name();
    if (this.description()) object.description = this.description();
    if (this.examples()) {
      object.examples = this.examples();
    } else if (this.example()) {
      object.example = this.example();
    }
    if (this[_private].default) object.default = this[_private].default;

    if (this[_private].min) object.minLength = this[_private].min;
    if (this[_private].max) object.maxLength = this[_private].max;

    return object;
  }
}

function RegexFactory(regex, options) {
  return new REGEX(regex, options);
}
module.exports = RegexFactory;
