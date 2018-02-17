const _ = require('lodash');
const ANY = require('./any').ANY;
const message = require('../message');
const helper = require('../helper');

const validateRegex = async (value, schema) => {
  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema.isRequired()) throw message.required(schema._language, schema._messages, value);
    return value;
  }

  if (!_.isString(value)) throw message.wrongType(schema._language, schema._messages, 'string', typeof value);

  if (value === '') {
    if (schema._empty) {
      return value;
    } else {
      throw message.get(schema._language, schema._messages, 'regex', 'empty');
    }
  }

  if (!value.match(schema._regex)) {
    throw schema._message[schema._language];
  }

  if (schema._min && value.length < schema._min) throw message.get(schema._language, schema._messages, 'regex', 'min', schema._min);
  if (schema._max && value.length > schema._max) throw message.get(schema._language, schema._messages, 'regex', 'max', schema._max);
  if (schema._length && value.length !== schema._length) throw message.get(schema._language, schema._messages, 'regex', 'length', schema._length);

  return value;
};

class REGEX extends ANY {
  constructor(regex, options, defaults) {
    super(options, defaults);

    if (!_.isRegExp(regex)) throw new Error('Invalid regular expression');
    this._regex = regex;
    this._empty = !_.defaultTo(options.noEmptyStrings, defaults.noEmptyStrings);
    this._trim = _.defaultTo(options.trimStrings, defaults.trimStrings);
    this._message = {
      en: message.get('en', this._messages, 'regex', 'invalid'),
      de: message.get('de', this._messages, 'regex', 'invalid'),
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
    return _.pickBy({
      type: 'regex',
      required: this.isRequired(),
      name: this._name,
      description: this._description,
      default: this._default,
      example: this._example,
      examples: this._examples,
      min: this._min,
      max: this._max,
      length: this._length,
      empty: this._empty,
      pattern: this._regex
    }, helper.isNotNil);
  }
}

exports.RegexFactory = (regex, options, defaults) => new REGEX(regex, options, defaults);
