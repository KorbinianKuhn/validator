const _ = require('lodash');
const BASE = require('./base');

var _options = Symbol();

class BOOLEAN extends BASE {
  constructor(options) {
    super();
    this[_options] = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_options], options);

    if (this.isRequired(options) && _.isNil(value)) {
      throw `Required but is ${value}.`;
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
}

function BooleanFactory(options) {
  return new BOOLEAN(options);
}
module.exports = BooleanFactory;
