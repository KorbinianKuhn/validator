const _ = require('lodash');
const ANY = require('./any').ANY;
const message = require('../message');
const helper = require('../helper');

const validateBoolean = async (value, schema) => {
  const language = schema._options.language;
  const messages = schema._options.messages;

  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema._required) throw message.required(language, messages, value);
    return value;
  }

  if (schema._parse) {
    if (value === 'true') value = true;
    if (value === 'false') value = false;
  }

  if (!_.isBoolean(value)) throw message.wrongType(language, messages, 'boolean', typeof value);

  return value;
};

class BOOLEAN extends ANY {
  constructor(options) {
    super(options);
  }

  async validate(value) {
    return helper.validate(this._options.type, validateBoolean(value, this));
  }

  default(value) {
    if (!_.isBoolean(value)) {
      throw new Error('Must be boolean.');
    }
    this._default = value;
    return this;
  }

  toObject() {
    return _.pickBy({
      type: 'boolean',
      required: this._required,
      name: this._name,
      description: this._description,
      default: this._default,
      example: this._example,
      examples: this._examples
    }, helper.isNotNil);
  }
}

exports.BooleanFactory = (options = {}) => new BOOLEAN(options);

