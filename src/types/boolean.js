const _ = require('lodash');
const BASE = require('./base');

class BOOLEAN extends BASE {
  constructor(options) {
    super(options);
  }

  async isValid(value, options = {}) {
    options = this.getOptions(options);

    if (this.isRequired(options) && _.isNil(value)) {
      this.errorMessage = `Required but is ${value}.`;
      return false;
    }

    if (!_.isBoolean(value)) {
      this.errorMessage = `Must be boolean but is ${typeof value}.`;
      return false;
    }

    return true;
  }
}

function BooleanFactory(options) {
  return new BOOLEAN(options);
}
module.exports = BooleanFactory;