const _ = require('lodash');
const message = require('../message');
const helper = require('../helper');
const { toObject } = require('../utils/to-object');

const validateAny = async (value, schema) => {
  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema._required) throw message.required(schema._language, schema._messages, value);
  }

  return value;
};

class ANY {
  constructor(options, defaults) {
    this._type = _.defaultTo(options.type, defaults.type);
    this._required = _.defaultTo(options.requiredAsDefault, defaults.requiredAsDefault);
    this._parse = _.defaultTo(options.parseToType, defaults.parseToType);
    this._language = _.defaultTo(options.language, defaults.language);
    this._messages = _.defaultTo(options.messages, defaults.messages);
  }

  async validate(value) {
    return validateAny(value, this);
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

  toObject(options = {}) {
    return toObject({
      type: 'any',
      required: this._required,
      description: this._description,
      default: this._default,
      example: this._example,
      parse: this._parse
    }, options);
  }
}

exports.validateAny = validateAny;
exports.ANY = ANY;
exports.AnyFactory = function (options, defaults) { return new ANY(options, defaults); };
