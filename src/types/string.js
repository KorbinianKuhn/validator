const _ = require('lodash');
const BASE = require('./base');
const message = require('../message');
const helper = require('../helper');

const _private = Symbol('Private variables');

const validateString = async (value, privates, options) => {
  if (_.isNil(value)) {
    if (privates.default) return privates.default;
    if (privates.required) throw message.required(options.language, options.type, value);
    return value;
  }

  if (!_.isString(value)) throw message.wrongType(options.language, options.type, 'string', typeof value);

  if (privates.trim || (privates.trim === undefined && options.trimStrings)) {
    value = value.trim();
  }

  if (value === '' && (privates.empty === false || (privates.empty === undefined && options.noEmptyStrings))) {
    throw message.get(options.language, options.type, 'string', 'empty');
  }

  if (privates.min && value.length < privates.min) throw message.get(options.language, options.type, 'string', 'min', privates.min);
  if (privates.max && value.length > privates.max) throw message.get(options.language, options.type, 'string', 'max', privates.max);
  if (privates.length && value.length !== privates.length) throw message.get(options.language, options.type, 'string', 'length', privates.length);

  return value;
};

class STRING extends BASE {
  constructor(options) {
    super();
    this[_private] = {};
    this[_private].options = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_private].options, options);

    const func = validateString(value, {
      required: this.isRequired(options),
      default: this[_private].default,
      min: this[_private].min,
      max: this[_private].max,
      length: this[_private].length,
      empty: this[_private].empty,
      trim: this[_private].trim,
    }, options);

    return helper.validate(options.type, func);
  }

  min(length) {
    this[_private].min = length;
    return this;
  }

  max(length) {
    this[_private].max = length;
    return this;
  }

  length(length) {
    this[_private].length = length;
    return this;
  }

  empty(boolean) {
    this[_private].empty = boolean;
    return this;
  }

  trim(boolean) {
    this[_private].trim = boolean;
    return this;
  }

  default(value) {
    if (!_.isString(value)) {
      throw new Error('Must be string.');
    }
    this[_private].default = value;
    return this;
  }

  toObject() {
    const object = {
      type: 'string',
      required: this.isRequired(this[_private].options)
    };

    if (this.name()) object.displayName = this.name();
    if (this.description()) object.description = this.description();
    if (this.examples()) {
      object.examples = this.examples();
    } else if (this.example()) {
      object.example = this.example();
    }
    if (this[_private].default) object.default = this[_private].default;

    if (this[_private].min) object.minLength = this[_private].min;
    if (this[_private].max) object.maxLength = this[_private].max;

    return object;
  }
}

function StringFactory(options) {
  return new STRING(options);
}
module.exports = StringFactory;
