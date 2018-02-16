const _ = require('lodash');
const ANY = require('./any').ANY;
const message = require('../message');
const helper = require('../helper');

const validateFunction = async (value, schema) => {
  const language = schema._options.language;
  const messages = schema._options.messages;

  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema._required) throw message.required(language, messages, value);
    return value;
  }

  try {
    return await schema._func(value, schema);
  } catch (err) {
    throw err.message;
  }
};

class FUNCTION extends ANY {
  constructor(func, options) {
    super(options);
    if (func === undefined) {
      throw new Error('Missing function.');
    }

    if (!_.isFunction(func)) {
      throw new Error('Not a function.');
    }

    this._func = func;
  }

  async validate(value) {
    return helper.validate(this._options.type, validateFunction(value, this));
  }

  toObject() {
    return _.pickBy({
      type: 'function',
      required: this._required,
      name: this._name,
      description: this._description,
      default: this._default,
      example: this._example,
      examples: this._examples
    }, helper.isNotNil);
  }
}

exports.FunctionFactory = (func, options = {}) => new FUNCTION(func, options);
