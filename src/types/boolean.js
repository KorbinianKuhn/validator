const _ = require('lodash');
const BASE = require('./base');

var _options = Symbol();
var _default = Symbol();

class BOOLEAN extends BASE {
  constructor(options) {
    super();
    this[_options] = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_options], options);

    if (_.isNil(value)) {
      if (this[_default]) return this[_default];
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

  defaultValue(value) {
    if (!_.isBoolean(value)) {
      throw new Error('Must be boolean.');
    }
    this[_default] = value;
    return this;
  }
}

function BooleanFactory(options) {
  return new BOOLEAN(options);
}
module.exports = BooleanFactory;
