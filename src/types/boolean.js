const _ = require('lodash');
const ANY = require('./any').ANY;
const message = require('../message');
const helper = require('../helper');

const validateBoolean = async (value, schema) => {
  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema.isRequired()) throw message.required(schema._language, schema._messages, value);
    return value;
  }

  if (schema._parse) {
    if (value === 'true') value = true;
    if (value === 'false') value = false;
  }

  if (!_.isBoolean(value)) throw message.wrongType(schema._language, schema._messages, 'boolean', typeof value);

  return value;
};

class BOOLEAN extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
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

  toObject(options = {}) {
    switch (options.type) {
      case 'raml': {
        return _.pickBy({
          type: 'boolean',
          required: this.isRequired(),
          displayName: this._name,
          description: this._description,
          default: this._default,
          example: this._example,
          examples: this._examples
        }, helper.isNotNil);
      }
      default: {
        return _.pickBy({
          type: 'boolean',
          required: this.isRequired(),
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

exports.BooleanFactory = (options, defaults) => new BOOLEAN(options, defaults);

