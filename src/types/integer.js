const _ = require('lodash');
const BASE = require('./base');
const message = require('../message');
const helper = require('../helper');

const _private = Symbol('Private variables');

const validateInteger = async (value, privates, options) => {
  if (_.isNil(value)) {
    if (privates.default) return privates.default;
    if (privates.required) throw message.required(options.language, options.type, value);
    return value;
  }

  if (options.parseToType && _.isString(value)) {
    if (value.match(/^[+-]?\d+$/)) value = parseInt(value);
  }

  if (!_.isInteger(value)) throw message.wrongType(options.language, options.type, 'integer', typeof value);
  if (privates.min && value < privates.min) throw message.get(options.language, options.type, 'integer', 'min', privates.min);
  if (privates.max && value > privates.max) throw message.get(options.language, options.type, 'integer', 'max', privates.max);
  if (privates.less && value >= privates.less) throw message.get(options.language, options.type, 'integer', 'less', privates.less);
  if (privates.greater && value <= privates.greater) throw message.get(options.language, options.type, 'integer', 'greater', privates.greater);
  if (privates.positive && value <= 0) throw message.get(options.language, options.type, 'integer', 'positive');
  if (privates.negative && value >= 0) throw message.get(options.language, options.type, 'integer', 'negative');

  return value;
};

class INTEGER extends BASE {
  constructor(options) {
    super();
    this[_private] = {};
    this[_private].options = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_private].options, options);

    const func = validateInteger(value, {
      required: this.isRequired(options),
      default: this[_private].default,
      min: this[_private].min,
      max: this[_private].max,
      less: this[_private].less,
      greater: this[_private].greater,
      positive: this[_private].positive,
      negative: this[_private].negative
    }, options);

    return helper.validate(options.type, func);
  }

  min(value) {
    this[_private].min = value;
    return this;
  }

  max(value) {
    this[_private].max = value;
    return this;
  }

  less(value) {
    this[_private].less = value;
    return this;
  }

  greater(value) {
    this[_private].greater = value;
    return this;
  }

  positive() {
    this[_private].positive = true;
    return this;
  }

  negative() {
    this[_private].negative = true;
    return this;
  }

  default(value) {
    if (!_.isInteger(value)) {
      throw new Error('Must be integer.');
    }
    this[_private].default = value;
    return this;
  }
}

function IntegerFactory(options) {
  return new INTEGER(options);
}
module.exports = IntegerFactory;
