const _ = require('lodash');
const ANY = require('./any').ANY;
const message = require('../message');
const helper = require('../helper');

const validateString = async (value, schema) => {
  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema.isRequired()) throw message.required(schema._language, schema._messages, value);
    return value;
  }

  if (!_.isString(value)) throw message.wrongType(schema._language, schema._messages, 'string', typeof value);

  if (schema._trim) {
    value = value.trim();
  }

  if (value === '' && schema._empty === false) {
    throw message.get(schema._language, schema._messages, 'string', 'empty');
  }

  if (schema._min && value.length < schema._min) throw message.get(schema._language, schema._messages, 'string', 'min', schema._min);
  if (schema._max && value.length > schema._max) throw message.get(schema._language, schema._messages, 'string', 'max', schema._max);
  if (schema._length && value.length !== schema._length) throw message.get(schema._language, schema._messages, 'string', 'length', schema._length);

  return value;
};

class STRING extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
    this._empty = !_.defaults(options.noEmptyStrings, defaults.noEmptyStrings);
    this._trim = _.defaultTo(options.trimStrings, defaults.trimStrings);
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

  toObject(options = {}) {
    switch (options.type) {
      case 'raml': {
        return _.pickBy({
          type: 'string',
          required: this.isRequired(),
          name: this._name,
          description: this._description,
          default: this._default,
          example: this._example,
          examples: this._examples,
          minLength: this._min,
          maxLength: this._max,
        }, helper.isNotNil);
      }
      default: {
        return _.pickBy({
          type: 'string',
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
          trim: this._trim
        }, helper.isNotNil);
      }
    }
  }
}

exports.StringFactory = (options, defaults) => new STRING(options, defaults);
