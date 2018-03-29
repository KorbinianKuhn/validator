const _ = require('lodash');
const ANY = require('./any').ANY;
const message = require('../message');
const helper = require('../helper');

const validateFunction = async (value, schema) => {
  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema._required) throw message.required(schema._language, schema._messages, value);
    return value;
  }

  try {
    return await schema._func(value, schema);
  } catch (err) {
    throw err.message;
  }
};

class FUNCTION extends ANY {
  constructor(func, options, defaults) {
    super(options, defaults);
    if (func === undefined) {
      throw new Error('Missing function.');
    }

    if (!_.isFunction(func)) {
      throw new Error('Not a function.');
    }

    this._func = func;
  }

  async validate(value) {
    return validateFunction(value, this);
  }

  toObject(options = {}) {
    switch (options.type) {
      case 'raml': {
        return _.pickBy({
          type: 'any',
          required: this._required,
          displayName: this._name,
          description: this._description,
          default: this._default,
          example: this._example,
          examples: this._examples
        }, helper.isNotNil);
      }
      default: {
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
  }
}

exports.validateFunction = validateFunction;
exports.FUNCTION = FUNCTION;
exports.FunctionFactory = (func, options, defaults) => new FUNCTION(func, options, defaults);
