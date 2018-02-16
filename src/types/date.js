const _ = require('lodash');
const moment = require('moment');
const ANY = require('./any').ANY;
const helper = require('../helper');
const message = require('../message');

const validateDate = async (value, schema) => {
  const language = schema._options.language;
  const messages = schema._options.messages;

  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema._required) throw message.required(language, messages, value);
    return value;
  }

  let date;
  if (this._utc) {
    date = moment.utc(value, this._format, this._strict);
  } else {
    date = moment(value, this._format, this._strict);
  }

  if (!date.isValid()) {
    throw message.get(language, messages, 'date', 'invalid', this._format);
  }

  if (schema._min && date.toDate() < schema._min) {
    throw message.get(language, messages, 'date', 'minimum', schema._min.toISOString());
  }

  if (schema._max && date.toDate() > schema._max) {
    throw message.get(language, messages, 'date', 'maximum', schema._max.toISOString());
  }

  if (schema._parse) {
    value = date.toDate();
  }

  return value;
};

class DATE extends ANY {
  constructor(options) {
    super(options);
    this._format = options.dateFormat;
    this._utc = options.utc;
    this._strict = options.strictDateValidation;
  }

  async validate(value) {
    return helper.validate(this._options.type, validateDate(value, this));
  }

  format(format) {
    this._format = format;
    return this;
  }

  default(value) {
    const date = moment(value, this._format, this._strict);
    if (!date.isValid()) {
      throw new Error(`Not a valid date. Must match format '${this._format}'.`);
    }
    this._default = value;
    return this;
  }

  strict(boolean) {
    this._strict = boolean;
    return this;
  }

  utc(boolean) {
    this._utc = boolean;
    return this;
  }

  min(date) {
    this._min = date;
    return this;
  }

  max(date) {
    this._max = date;
    return this;
  }

  toObject() {
    return _.pickBy({
      type: 'date',
      required: this._required,
      name: this._name,
      description: this._description,
      default: this._default,
      example: this._example,
      examples: this._examples,
      min: this._min,
      max: this._max,
      format: this._format,
      utc: this._utc,
      strict: this._strict
    }, helper.isNotNil);
  }
}

exports.DateFactory = (options = {}) => new DATE(options);
