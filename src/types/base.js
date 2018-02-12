const _ = require('lodash');

var _required = Symbol();
class BASE {
  constructor() {}

  required(required) {
    this[_required] = required;
    return this;
  }

  isRequired(options = {}) {
    if (this[_required] === undefined) {
      return options.requiredAsDefault || false;
    } else {
      return this[_required];
    }
  }

  hasRequiredProperty() {
    return this[_required] !== undefined;
  }
}

module.exports = BASE;
