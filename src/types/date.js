const _ = require('lodash');
const moment = require('moment');
const ANY = require('./any').ANY;
const helper = require('../helper');
const message = require('../message');

const toMoment = (date, utc, format, strict) => {
  if (utc) {
    return moment.utc(date, format, strict);
  } else {
    return moment(date, format, strict);
  }
};

const validateDate = async (value, schema) => {
  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema._required) throw message.required(schema._language, schema._messages, value);
    return value;
  }

  const date = toMoment(value, schema._utc, schema._format, schema._strict);

  if (!date.isValid()) {
    throw message.get(schema._language, schema._messages, 'date', 'invalid', schema._format);
  }

  if (schema._min && date.toDate() < schema._min) {
    throw message.get(schema._language, schema._messages, 'date', 'minimum', schema._min.toISOString());
  }

  if (schema._max && date.toDate() > schema._max) {
    throw message.get(schema._language, schema._messages, 'date', 'maximum', schema._max.toISOString());
  }

  if (schema._parse) {
    value = date.toDate();
  }

  return value;
};

class DATE extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
    this._format = _.defaultTo(options.dateFormat, defaults.dateFormat);
    this._utc = _.defaultTo(options.utc, defaults.utc);
    this._strict = _.defaultTo(options.strictDateValidation, defaults.strictDateValidation);
  }

  async validate(value) {
    return helper.validate(this._options.type, validateDate(value, this));
  }

  format(string) {
    this._format = string;
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
    this._min = toMoment(date, this._utc, this._format, this._strict).toDate();
    return this;
  }

  max(date) {
    this._max = toMoment(date, this._utc, this._format, this._strict).toDate();
    return this;
  }

  toObject(options = {}) {
    const min = this._min ? this._min.toISOString() : undefined;
    const max = this._max ? this._max.toISOString() : undefined;
    switch (options.type) {
      case 'raml': {
        return _.pickBy({
          type: 'datetime',
          required: this._required,
          displayName: this._name,
          description: this._description,
          default: this._default,
          example: this._example,
          examples: this._examples
        }, helper.isNotNil);
      }
      default: {
        return _.pickBy({
          type: 'date',
          required: this._required,
          name: this._name,
          description: this._description,
          default: this._default,
          example: this._example,
          examples: this._examples,
          min,
          max,
          format: this._format,
          utc: this._utc,
          strict: this._strict
        }, helper.isNotNil);
      }
    }
  }
}

exports.DateFactory = (options, defaults) => new DATE(options, defaults);
