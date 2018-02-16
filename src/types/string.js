const _ = require('lodash');
const ANY = require('./any').ANY;
const message = require('../message');
const helper = require('../helper');

const validateString = async (value, schema) => {
  const language = schema._options.language;
  const messages = schema._options.messages;

  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema._required) throw message.required(language, messages, value);
    return value;
  }

  if (!_.isString(value)) throw message.wrongType(language, messages, 'string', typeof value);

  if (schema._trim) {
    value = value.trim();
  }

  if (value === '' && schema._empty) {
    throw message.get(language, messages, 'string', 'empty');
  }

  if (schema._min && value.length < schema._min) throw message.get(language, messages, 'string', 'min', schema._min);
  if (schema._max && value.length > schema._max) throw message.get(language, messages, 'string', 'max', schema._max);
  if (schema._length && value.length !== schema._length) throw message.get(language, messages, 'string', 'length', schema._length);

  return value;
};

class STRING extends ANY {
  constructor(options) {
    super(options);
  }

  async validate(value) {
    return helper.validate(this._options.type, validateString(value, this));
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

  trim(boolean) {
    this._trim = boolean;
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

exports.StringFactory = (options = {}) => new STRING(options);
