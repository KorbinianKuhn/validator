const _ = require('lodash');
const ANY = require('./any').ANY;
const helper = require('../helper');
const message = require('../message');

const validateArray = async (value, schema) => {
  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema.isRequired()) throw message.required(schema._language, schema._messages, value);
    return value;
  }

  if (schema._parse && _.isString(value)) {
    try {
      value = JSON.parse(value);
    } catch (err) {
      value = value.split(',');
    }
  }

  if (!_.isArray(value)) throw message.wrongType(schema._language, schema._messages, 'array', typeof value);

  if (schema._empty === false && value.length === 0) {
    throw message.get(schema._language, schema._messages, 'array', 'empty');
  }

  if (schema._min && value.length < schema._min) {
    throw message.get(schema._language, schema._messages, 'array', 'min', schema._min);
  }

  if (schema._max && value.length > schema._max) {
    throw message.get(schema._language, schema._messages, 'array', 'max', schema._max);
  }

  if (schema._length && value.length !== schema._length) {
    throw message.get(schema._language, schema._messages, 'array', 'length', schema._length);
  }

  if (schema._unique && _.uniqWith(value, _.isEqual).length !== value.length) {
    throw message.get(schema._language, schema._messages, 'array', 'unique');
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
  constructor(type, options, defaults) {
    super(options, defaults);
    this._type = type;
    this._empty = !_.defaultTo(options.noEmptyArrays, defaults.noEmptyArrays);
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
      required: this.isRequired(),
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

exports.ArrayFactory = (type, options, defaults) => new ARRAY(type, options, defaults);
