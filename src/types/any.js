const _ = require('lodash');
const message = require('../message');
const helper = require('../helper');

const validateAny = async (value, schema) => {
  const language = schema._options.language;
  const messages = schema._options.messages;

  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema._required) throw message.required(language, messages, value);
  }

  return value;
};

class ANY {
  constructor(options) {
    this._options = options;
    this._required = options.requiredAsDefault;
    this._parse = options.parseToType;
  }

  async validate(value) {
    return helper.validate(this._options.type, validateAny(value, this));
  }

  required(required) {
    this._required = required;
    return this;
  }

  name(name) {
    this._name = name;
    return this;
  }

  description(description) {
    this._description = description;
    return this;
  }

  example(example) {
    this._example = example;
    return this;
  }

  examples(...examples) {
    this._examples = examples;
    return this;
  }

  default(value) {
    this._default = value;
    return this;
  }

  parse(boolean) {
    this._parse = boolean;
    return this;
  }

  toObject() {
    return _.pickBy({
      type: 'any',
      required: this._required,
      name: this._name,
      description: this._description,
      default: this._default,
      example: this._example,
      examples: this._examples
    }, helper.isNotNil);
  }
}

exports.ANY = ANY;
exports.AnyFactory = (options = {}) => new ANY(options);
