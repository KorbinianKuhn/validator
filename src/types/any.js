const _ = require('lodash');
const message = require('../message');
const helper = require('../helper');

const validateAny = async (value, schema) => {
  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema.isRequired()) throw message.required(schema._language, schema._messages, value);
  }

  return value;
};

class ANY {
  constructor(options, defaults) {
    this._options = options;
    this._defaults = defaults;
    this._required = _.defaultTo(options.requiredAsDefault, undefined);
    this._parse = _.defaultTo(options.parseToType, defaults.parseToType);
    this._language = _.defaultTo(options.language, defaults.language);
    this._messages = _.defaultTo(options.messages, defaults.messages);
  }

  async validate(value) {
    return helper.validate(this._options.type, validateAny(value, this));
  }

  required(required) {
    this._required = required;
    return this;
  }

  isRequired() {
    return _.defaultTo(this._required, this._defaults.requiredAsDefault);
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
      required: this.isRequired(),
      name: this._name,
      description: this._description,
      default: this._default,
      example: this._example,
      examples: this._examples,
      parse: this._parse
    }, helper.isNotNil);
  }
}

exports.ANY = ANY;
exports.AnyFactory = (options, defaults) => new ANY(options, defaults);
