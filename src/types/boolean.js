const _ = require('lodash');
const BASE = require('./base');

var _private = Symbol();

class BOOLEAN extends BASE {
  constructor(options) {
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

    if (options.parseToType) {
      if (value === 'true') value = true;
      if (value === 'false') value = false;
    }

    if (!_.isBoolean(value)) {
      throw `Must be boolean but is ${typeof value}.`;
    }

    return value;
  }

  default (value) {
    if (!_.isBoolean(value)) {
      throw new Error('Must be boolean.');
    }
    this[_private].default = value;
    return this;
  }

  // Deprecated remove in v1
  defaultValue(value) {
    console.log('using defaultValue() is deprecated. Use default() instead.');
    return this.default(value);
  }
}

function BooleanFactory(options) {
  return new BOOLEAN(options);
}
module.exports = BooleanFactory;
