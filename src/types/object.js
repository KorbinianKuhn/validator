const _ = require('lodash');
const BASE = require('./base');

var _object = Symbol();
var _options = Symbol();
var _default = Symbol();
var _empty = Symbol();

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

    if (_.isNil(value)) {
      if (this[_default]) return this[_default];
      if (this.isRequired(options)) throw `Required but is ${value}.`;
      return value;
    }

    if (options.parseToType && _.isString(value)) {
      try {
        value = JSON.parse(value);
      } catch (err) {}
    }

    if (!_.isPlainObject(value)) {
      throw `Must be object.`;
    }

    if (_.keys(value).length === 0 && (this[_empty] === false || (this[_empty] === undefined && options.noEmptyObjects))) {
      throw `Object is empty.`;
    }

    const errors = {}
    for (const key in this[_object]) {
      try {
        const result = await this[_object][key].validate(value[key], options);
        if (!_.isNil(result)) value[key] = result;
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

  empty(boolean) {
    this[_empty] = boolean;
    return this;
  }

  defaultValue(value) {
    if (!_.isPlainObject(value)) {
      throw new Error('Must be object.');
    }
    this[_default] = value;
    return this;
  }
}

function ObjectFactory(object, options) {
  return new OBJECT(object, options);
}
module.exports = ObjectFactory;
