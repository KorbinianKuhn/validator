const _ = require('lodash');
const moment = require('moment');
const BASE = require('./base');
const defaults = require('../defaults');

var _private = Symbol();

class DATE extends BASE {
  constructor(format, options) {
    super();
    this[_private] = {};
    this[_private].options = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_private].options, options);

    if (_.isNil(value)) {
      if (this[_private].default) return this[_private].default;
      if (this.isRequired(options)) throw `Required but is ${value}.`;
      return value;
    }

    const format = this[_private].format || options.dateFormat || defaults.DATE_FORMAT;

    const utc = _.defaultTo(this[_private].utc, _.defaultTo(options.utc, true));
    const strict = _.defaultTo(this[_private].strict, _.defaultTo(options.strictDateValidation, true));

    let date;
    if (utc) {
      date = moment.utc(value, format, strict);
    } else {
      date = moment(value, format, strict);
    }

    if (!date.isValid()) {
      throw `Not a valid date. Must match format '${format}'`;
    }

    if (this[_private].min && date.toDate() < this[_private].min) {
      throw `Must be at minimum '${this[_private].min.toISOString()}'`;
    }

    if (this[_private].max && date.toDate() > this[_private].max) {
      throw `Must be at maximum '${this[_private].max.toISOString()}'`;
    }

    if (this[_private].parse || options.parseDates) {
      value = date.toDate();
    }

    return value;
  }

  format(format) {
    this[_private].format = format;
    return this;
  }

  parse(boolean) {
    this[_private].parse = boolean;
    return this;
  }

  default (value) {
    const format = this[_private].format || this[_private].options.dateFormat || defaults.DATE_FORMAT;
    const date = moment(value, format, true);
    if (!date.isValid()) {
      throw new Error(`Not a valid date. Must match format '${format}'`);
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

  // Deprecated remove in v1
  defaultValue(value) {
    console.log('using defaultValue() is deprecated. Use default() instead.');
    return this.default(value);
  }
}

function DateFactory(options) {
  return new DATE(options);
}
module.exports = DateFactory;
