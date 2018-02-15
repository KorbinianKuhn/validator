const _ = require('lodash');
const BASE = require('./base');
const helper = require('../helper');
const message = require('../message');

const _private = Symbol('Private variables');

const validateEnum = async (value, privates, options) => {
  if (_.isNil(value)) {
    if (privates.default) return privates.default;
    if (privates.required) throw message.required(options.language, options.type, value);
    return value;
  }

  if (privates.values.indexOf(value) === -1) throw message.get(options.language, options.type, 'enum', 'invalid', value, privates.values.toString());

  return value;
};

class ENUM extends BASE {
  constructor(values, options) {
    super();

    if (!values) {
      throw new Error('Missing values for enum.');
    }

    if (!_.isArray(values)) {
      throw new Error('Values must be an array.');
    }

    this[_private] = {};
    this[_private].values = values;
    this[_private].options = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_private].options, options);

    const func = validateEnum(value, {
      required: this.isRequired(options),
      default: this[_private].default,
      values: this[_private].values
    }, options);

    return helper.validate(options.type, func);
  }

  default(value) {
    this[_private].default = value;
    return this;
  }
}

function EnumFactory(values, options) {
  return new ENUM(values, options);
}
module.exports = EnumFactory;
