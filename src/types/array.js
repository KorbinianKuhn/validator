const _ = require('lodash');
const BASE = require('./base');

var _type = Symbol();
var _options = Symbol();
var _minLength = Symbol();
var _maxLength = Symbol();
var _exactLength = Symbol();

class ARRAY extends BASE {
  constructor(type, options) {
    super();
    this[_type] = type;
    this[_options] = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_options], options);

    if (this.isRequired(options) && _.isNil(value)) {
      throw `Required but is ${value}.`;
    }

    if (!_.isArray(value)) {
      throw `Must be array but is ${typeof value}.`;
    }

    if (options.noEmptyArrays && value.length === 0) {
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
}

function NewArray(regex) {
  return new ARRAY(regex);
}
module.exports = NewArray;
