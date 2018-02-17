const _ = require('lodash');
const ANY = require('./any').ANY;
const message = require('../message');
const helper = require('../helper');

const validateNumber = async (value, schema) => {
  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema.isRequired()) throw message.required(schema._language, schema._messages, value);
    return value;
  }

  if (schema._parse && _.isString(value) && value.match(/^[-/+]?\d+(\.\d+)?$/)) {
    value = parseFloat(value);
  }

  if (!_.isNumber(value)) throw message.wrongType(schema._language, schema._messages, 'number', typeof value);
  if (schema._min && value < schema._min) throw message.get(schema._language, schema._messages, 'number', 'min', schema._min);
  if (schema._max && value > schema._max) throw message.get(schema._language, schema._messages, 'number', 'max', schema._max);
  if (schema._less && value >= schema._less) throw message.get(schema._language, schema._messages, 'number', 'less', schema._less);
  if (schema._greater && value <= schema._greater) throw message.get(schema._language, schema._messages, 'number', 'greater', schema._greater);
  if (schema._positive && value <= 0) throw message.get(schema._language, schema._messages, 'number', 'positive');
  if (schema._negative && value >= 0) throw message.get(schema._language, schema._messages, 'number', 'negative');

  return value;
};

class NUMBER extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
  }

  async validate(value) {
    return helper.validate(this._options.type, validateNumber(value, this));
  }

  min(value) {
    this._min = value;
    return this;
  }

  max(value) {
    this._max = value;
    return this;
  }

  less(value) {
    this._less = value;
    return this;
  }

  greater(value) {
    this._greater = value;
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
    if (!_.isNumber(value)) {
      throw new Error('Must be number.');
    }
    this._default = value;
    return this;
  }

  toObject() {
    return _.pickBy({
      type: 'number',
      required: this.isRequired(),
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

exports.NumberFactory = (options, defaults) => new NUMBER(options, defaults);
