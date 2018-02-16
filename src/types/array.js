const _ = require('lodash');
const ANY = require('./any').ANY;
const helper = require('../helper');
const message = require('../message');

const validateArray = async (value, schema) => {
  const language = schema._options.language;
  const messages = schema._options.messages;

  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema._required) throw message.required(language, messages, value);
    return value;
  }

  if (schema._parse && _.isString(value)) {
    try {
      value = JSON.parse(value);
    } catch (err) {
      value = value.split(',');
    }
  }

  if (!_.isArray(value)) throw message.wrongType(language, messages, 'array', typeof value);

  if (schema._empty === false && value.length === 0) {
    throw message.get(language, messages, 'array', 'empty');
  }

  if (schema._min && value.length < schema._min) {
    throw message.get(language, messages, 'array', 'min', schema._min);
  }

  if (schema._max && value.length > schema._max) {
    throw message.get(language, messages, 'array', 'max', schema._max);
  }

  if (schema._length && value.length !== schema._length) {
    throw message.get(language, messages, 'array', 'length', schema._length);
  }

  if (schema._unique && _.uniqWith(value, _.isEqual).length !== value.length) {
    throw message.get(language, messages, 'array', 'unique');
  }

  if (schema._type !== undefined) {
    const errors = {};

    for (const index in value) {
      try {
        value[index] = await schema._type.validate(value[index]);
      } catch (err) {
        errors[index] = err;
      }
    }

    if (_.keys(errors).length > 0) {
      throw errors;
    } else {
      return value;
    }
  } else {
    return value;
  }
};

class ARRAY extends ANY {
  constructor(type, options) {
    super(options);
    this._type = type;
    this._empty = options.noEmptyArrays;
  }

  async validate(value) {
    return helper.validate(this._options.type, validateArray(value, this));
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

  default(value) {
    if (!_.isArray(value)) {
      throw new Error('Must be array.');
    }
    this._default = value;
    return this;
  }

  unique(boolean) {
    this._unique = boolean;
    return this;
  }

  toObject() {
    const items = this._type ? this._type.toObject() : undefined;
    return _.pickBy({
      type: 'array',
      required: this._required,
      name: this._name,
      description: this._description,
      default: this._default,
      example: this._example,
      examples: this._examples,
      min: this._min,
      max: this._max,
      unique: this._unique,
      empty: this._empty,
      items
    }, helper.isNotNil);
  }
}

exports.ArrayFactory = (type, options = {}) => new ARRAY(type, options);
