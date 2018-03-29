const _ = require('lodash');
const ANY = require('./any').ANY;
const helper = require('../helper');
const message = require('../message');

const validateEnum = async (value, schema) => {
  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema._required) throw message.required(schema._language, schema._messages, value);
    return value;
  }

  if (schema._values.indexOf(value) === -1) throw message.get(schema._language, schema._messages, 'enum', 'invalid', value, schema._values.toString());

  return value;
};

class ENUM extends ANY {
  constructor(values, options, defaults) {
    super(options, defaults);

    if (!values) {
      throw new Error('Missing values for enum.');
    }

    if (!_.isArray(values)) {
      throw new Error('Values must be an array.');
    }

    this._values = values;
  }

  async validate(value) {
    return validateEnum(value, this);
  }

  default(value) {
    if (this._values.indexOf(value) === -1) {
      throw new Error('Default value must be part of enum.');
    }
    this._default = value;
    return this;
  }

  toObject(options = {}) {
    switch (options.type) {
      case 'raml': {
        return _.pickBy({
          required: this._required,
          displayName: this._name,
          description: this._description,
          default: this._default,
          example: this._example,
          examples: this._examples,
          enum: this._values
        }, helper.isNotNil);
      }
      default: {
        return _.pickBy({
          type: 'enum',
          required: this._required,
          name: this._name,
          description: this._description,
          default: this._default,
          example: this._example,
          examples: this._examples,
          enum: this._values
        }, helper.isNotNil);
      }
    }
  }
}

exports.validateEnum = validateEnum;
exports.ENUM = ENUM;
exports.EnumFactory = (values, options, defaults) => new ENUM(values, options, defaults);
