const _ = require('lodash');
const ANY = require('./any').ANY;
const message = require('../message');
const helper = require('../helper');

const validateInteger = async (value, schema) => {
  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema._required) throw message.required(schema._language, schema._messages, value);
    return value;
  }

  if (schema._parse && _.isString(value) && value.match(/^[+-]?\d+$/)) {
    value = parseInt(value);
  }

  if (!_.isInteger(value)) throw message.wrongType(schema._language, schema._messages, 'integer', typeof value);
  if (schema._min && value < schema._min) throw message.get(schema._language, schema._messages, 'integer', 'min', schema._min);
  if (schema._max && value > schema._max) throw message.get(schema._language, schema._messages, 'integer', 'max', schema._max);
  if (schema._less && value >= schema._less) throw message.get(schema._language, schema._messages, 'integer', 'less', schema._less);
  if (schema._greater && value <= schema._greater) throw message.get(schema._language, schema._messages, 'integer', 'greater', schema._greater);
  if (schema._positive && value <= 0) throw message.get(schema._language, schema._messages, 'integer', 'positive');
  if (schema._negative && value >= 0) throw message.get(schema._language, schema._messages, 'integer', 'negative');

  return value;
};

class INTEGER extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
  }

  async validate(value) {
    return helper.validate(this._options.type, validateInteger(value, this));
  }

  min(integer) {
    this._min = integer;
    return this;
  }

  max(integer) {
    this._max = integer;
    return this;
  }

  less(integer) {
    this._less = integer;
    return this;
  }

  greater(integer) {
    this._greater = integer;
    return this;
  }

  positive() {
    this._positive = true;
    return this;
  }

  negative() {
    this._negative = true;
    return this;
  }

  default(value) {
    if (!_.isInteger(value)) {
      throw new Error('Must be integer.');
    }
    this._default = value;
    return this;
  }

  toObject(options = {}) {
    switch (options.type) {
      case 'raml': {
        return _.pickBy({
          type: 'integer',
          required: this._required,
          displayName: this._name,
          description: this._description,
          default: this._default,
          example: this._example,
          examples: this._examples,
          minimum: this._min,
          maximum: this._max,
        }, helper.isNotNil);
      }
      default: {
        return _.pickBy({
          type: 'integer',
          required: this._required,
          name: this._name,
          description: this._description,
          default: this._default,
          example: this._example,
          examples: this._examples,
          min: this._min,
          max: this._max,
          less: this._less,
          greater: this._greater,
          positive: this._positive,
          negative: this._negative
        }, helper.isNotNil);
      }
    }
  }
}

exports.IntegerFactory = (options, defaults) => new INTEGER(options, defaults);
