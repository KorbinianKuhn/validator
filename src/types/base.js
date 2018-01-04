const _ = require('lodash');

var _required = Symbol();
var _options = Symbol();

class BASE {
  constructor(options) {
    if (options) {
      this[_options] = options;
    }
  }

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

  getOptions(options = {}) {
    if (this[_options]) {
      const mergedOptions = {};
      for (const key in options) {
        mergedOptions[key] = this[_options][key] || options[key];
      }
      for (const key in this[_options]) {
        if (!_.has(mergedOptions, key)) {
          mergedOptions[key] = this[_options][key];
        }
      }
      return mergedOptions;
    } else {
      return options;
    }
  }
}

module.exports = BASE;