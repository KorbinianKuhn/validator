const _ = require('lodash');
const ANY = require('./any').ANY;
const message = require('../message');
const helper = require('../helper');

const validateRegex = async (value, schema) => {
  const language = schema._options.language;
  const messages = schema._options.messages;

  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema._required) throw message.required(language, messages, value);
    return value;
  }

  if (!_.isString(value)) throw message.wrongType(language, messages, 'string', typeof value);

  if (value === '' && schema._empty) {
    return value;
  }

  if (!value.match(schema._regex)) {
    throw schema._message[language];
  }

  if (schema._min && value.length < schema._min) throw message.get(language, messages, 'regex', 'min', schema._min);
  if (schema._max && value.length > schema._max) throw message.get(language, messages, 'regex', 'max', schema._max);
  if (schema._length && value.length !== schema._length) throw message.get(language, messages, 'regex', 'length', schema._length);

  return value;
};

class REGEX extends ANY {
  constructor(regex, options) {
    super(options);
    if (!_.isRegExp(regex)) throw new Error('Invalid regular expression');
    this._regex = regex;
    this._message = {
      en: message.get('en', this._options.messages, 'regex', 'invalid'),
      de: message.get('de', this._options.messages, 'regex', 'invalid'),
    };
  }

  async validate(value) {
    return helper.validate(this._options.type, validateRegex(value, this));
  }

  min(length) {
    this._min = length;
    return this;
  }

  max(length) {
    this._max = length;
    return this;
  }

  length(length) {
    this._length = length;
    return this;
  }

  empty(boolean) {
    this._empty = boolean;
    return this;
  }

  message(text, language = 'en') {
    this._message[language] = text;
    return this;
  }

  default(value) {
    if (!_.isString(value)) {
      throw new Error('Must be string.');
    }
    this._default = value;
    return this;
  }

  toObject() {
    throw new Error('Not Implemented');
  }
}

exports.RegexFactory = (options = {}) => new REGEX(options);
