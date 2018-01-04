const _ = require('lodash');
const BASE = require('./base');

var _object = Symbol();
var _options = Symbol();

class OBJECT extends BASE {
  constructor(object, options) {
    super();

    if (object === undefined) {
      throw new Error('Missing object.');
    }

    if (!_.isPlainObject(object)) {
      throw new Error('Invalid object.');
    }

    this[_object] = object;
    this[_options] = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_options], options);

    if (this.isRequired(options) && _.isNil(value)) {
      throw `Required but is ${value}.`;
    }

    if (!_.isPlainObject(value)) {
      throw `Must be object.`;
    }

    if (options.noEmptyObjects && _.keys(value).length === 0) {
      throw `Object is empty.`;
    }

    const errors = {}
    for (const key in this[_object]) {
      try {
        value[key] = await this[_object][key].validate(value[key], options);
      } catch (err) {
        errors[key] = err;
      }
    }

    if (_.keys(errors).length > 0) {
      throw errors;
    } else {
      return value;
    }
  }
}

function ObjectFactory(object, options) {
  return new OBJECT(object, options);
}
module.exports = ObjectFactory;
