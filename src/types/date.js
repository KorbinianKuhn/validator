const _ = require('lodash');
const moment = require('moment');
const BASE = require('./base');
const defaults = require('../defaults');
const helper = require('../helper');
const message = require('../message');

const _private = Symbol('Private variables');

const validateDate = async (value, privates, options) => {
  if (_.isNil(value)) {
    if (privates.default) return privates.default;
    if (privates.required) throw message.required(options.language, options.type, value);
    return value;
  }

  const format = privates.format || options.dateFormat || defaults.DATE_FORMAT;

  const utc = _.defaultTo(privates.utc, _.defaultTo(options.utc, true));
  const strict = _.defaultTo(privates.strict, _.defaultTo(options.strictDateValidation, true));

  let date;
  if (utc) {
    date = moment.utc(value, format, strict);
  } else {
    date = moment(value, format, strict);
  }

  if (!date.isValid()) {
    throw message.get(options.language, options.type, 'date', 'invalid', format);
  }

  if (privates.min && date.toDate() < privates.min) {
    throw message.get(options.language, options.type, 'date', 'minimum', privates.min.toISOString());
  }

  if (privates.max && date.toDate() > privates.max) {
    throw message.get(options.language, options.type, 'date', 'maximum', privates.max.toISOString());
  }

  if (privates.parse || options.parseDates) {
    value = date.toDate();
  }

  return value;
};

class DATE extends BASE {
  constructor(format, options) {
    super();
    this[_private] = {};
    this[_private].options = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_private].options, options);

    const func = validateDate(value, {
      required: this.isRequired(options),
      default: this[_private].default,
      format: this[_private].format,
      utc: this[_private].utc,
      strict: this[_private].strict,
      min: this[_private].min,
      max: this[_private].max,
      parse: this[_private].parse
    }, options);

    return helper.validate(options.type, func);
  }

  format(format) {
    this[_private].format = format;
    return this;
  }

  parse(boolean) {
    this[_private].parse = boolean;
    return this;
  }

  default(value) {
    const format = this[_private].format || this[_private].options.dateFormat || defaults.DATE_FORMAT;
    const date = moment(value, format, true);
    if (!date.isValid()) {
      throw new Error(`Not a valid date. Must match format '${format}'.`);
    }
    this[_private].default = value;
    return this;
  }

  strict(boolean) {
    this[_private].strict = boolean;
    return this;
  }

  utc(boolean) {
    this[_private].utc = boolean;
    return this;
  }

  min(date) {
    this[_private].min = date;
    return this;
  }

  max(date) {
    this[_private].max = date;
    return this;
  }
}

function DateFactory(options) {
  return new DATE(options);
}
module.exports = DateFactory;
