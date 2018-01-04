const _ = require('lodash');
const BASE = require('./base');

var _min = Symbol();
var _max = Symbol();

class INTEGER extends BASE {
  constructor(options) {
    super(options);
  }

  async isValid(value, options = {}) {
    options = this.getOptions(options);

    if (this.isRequired(options) && _.isNil(value)) {
      this.errorMessage = `Required but is ${value}.`;
      return false;
    }

    if (!_.isInteger(value)) {
      this.errorMessage = `Must be integer but is ${typeof value}.`;
      return false;
    }

    if (this[_min] && value < this[_min]) {
      this.errorMessage = `Must be at minimum ${this[_min]}.`;
      return false;
    }

    if (this[_max] && value > this[_max]) {
      this.errorMessage = `Must be at maximum ${this[_max]}.`;
      return false;
    }

    return true;
  }

  min(value) {
    this[_min] = value;
    return this;
  }

  max(value) {
    this[_max] = value;
    return this;
  }

}

function IntegerFactory(options) {
  return new INTEGER(options);
}
module.exports = IntegerFactory;