const _ = require('lodash');
const BASE = require('./base');

var _object = Symbol();
var _options = Symbol();

class OBJECT extends BASE {
  constructor(object, options) {
    super(options);

    if (object === undefined) {
      throw new Error('Missing object.');
    }

    if (!_.isPlainObject(object)) {
      throw new Error('Invalid object.');
    }

    this[_object] = object;
  }

  async isValid(value, options = {}) {
    options = this.getOptions(options);

    if (this.isRequired(options) && _.isNil(value)) {
      this.errorMessage = `Required but is ${value}.`;
      return false;
    }

    if (!_.isPlainObject(value)) {
      this.errorMessage = `Must be object.`;
      return false;
    }

    if (options.noEmptyObjects && _.keys(value).length === 0) {
      this.errorMessage = `Object is empty.`;
      return false;
    }

    const errors = {}
    for (const key in this[_object]) {
      const valid = await this[_object][key].isValid(value[key], options);
      if (!valid) {
        errors[key] = this[_object][key].errorMessage;
      }
    }

    if (_.keys(errors).length > 0) {
      this.errorMessage = errors;
      return false;
    } else {
      delete this.errorMessage;
      return true;
    }
  }
}

function ObjectFactory(object, options) {
  return new OBJECT(object, options);
}
module.exports = ObjectFactory;