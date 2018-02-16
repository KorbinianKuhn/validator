const _ = require('lodash');
const ANY = require('./any').ANY;
const helper = require('../helper');
const message = require('../message');

const validateEnum = async (value, schema) => {
  const language = schema._options.language;
  const messages = schema._options.messages;

  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema._required) throw message.required(language, messages, value);
    return value;
  }

  if (schema._values.indexOf(value) === -1) throw message.get(language, messages, 'enum', 'invalid', value, schema._values.toString());

  return value;
};

class ENUM extends ANY {
  constructor(values, options) {
    super(options);

    if (!values) {
      throw new Error('Missing values for enum.');
    }

    if (!_.isArray(values)) {
      throw new Error('Values must be an array.');
    }

    this._values = values;
  }

  async validate(value) {
    return helper.validate(this._options.type, validateEnum(value, this));
  }

  default(value) {
    if (!_.isArray(value)) {
      throw new Error('Must be array.');
    }
    this._default = value;
    return this;
  }

  toObject() {
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

exports.EnumFactory = (values, options = {}) => new ENUM(values, options);
