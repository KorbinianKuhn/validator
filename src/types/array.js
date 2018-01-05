const _ = require('lodash');
const BASE = require('./base');

var _type = Symbol();
var _options = Symbol();
var _minLength = Symbol();
var _maxLength = Symbol();
var _exactLength = Symbol();
var _empty = Symbol();
var _default = Symbol();
var _unique = Symbol();

class ARRAY extends BASE {
  constructor(type, options) {
    super();
    this[_type] = type;
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
      } catch (err) {
        value = value.split(',');
      }
    }

    if (!_.isArray(value)) {
      throw `Must be array but is ${typeof value}.`;
    }

    if (value.length === 0 && (this[_empty] === false || (this[_empty] === undefined && options.noEmptyArrays))) {
      throw `Array is empty.`;
    }

    if (this[_minLength] && value.length < this[_minLength]) {
      throw `Must have at least ${this[_minLength]} items.`;
    }

    if (this[_maxLength] && value.length > this[_maxLength]) {
      throw `Must have at most ${this[_maxLength]} items.`;
    }

    if (this[_exactLength] && value.length !== this[_exactLength]) {
      throw `Must have exactly ${this[_exactLength]} items.`;
    }

    if (this[_unique] && _.uniqWith(value, _.isEqual).length !== value.length) {
      throw 'Values must be unique.';
    }

    if (this[_type] !== undefined) {
      const errors = {};

      for (const index in value) {
        try {
          value[index] = await this[_type].validate(value[index], options);
        } catch (err) {
          errors[index] = err;
        }
      }

      if (_.keys(errors).length > 0) {
        throw errors;
      } else {
        return value;
      }
    } else {
      return value;
    }
  }

  minLength(length) {
    this[_minLength] = length;
    return this;
  }

  maxLength(length) {
    this[_maxLength] = length;
    return this;
  }

  exactLength(length) {
    this[_exactLength] = length;
    return this;
  }

  empty(boolean) {
    this[_empty] = boolean;
    return this;
  }

  defaultValue(value) {
    if (!_.isArray(value)) {
      throw new Error('Must be array.');
    }
    this[_default] = value;
    return this;
  }

  unique(boolean) {
    this[_unique] = boolean;
    return this;
  }
}

function NewArray(type, options) {
  return new ARRAY(type, options);
}
module.exports = NewArray;
