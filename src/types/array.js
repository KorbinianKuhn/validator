const _ = require('lodash');
const BASE = require('./base');

var _type = Symbol();
var _minLength = Symbol();
var _maxLength = Symbol();
var _exactLength = Symbol();

class ARRAY extends BASE {
  constructor(type) {
    super();
    this[_type] = type;
  }

  async isValid(value, options = {}) {
    options = this.getOptions(options);

    if (this.isRequired(options) && _.isNil(value)) {
      this.errorMessage = `Required but is ${value}.`;
      return false;
    }

    if (!_.isArray(value)) {
      this.errorMessage = `Must be array but is ${typeof value}.`;
      return false;
    }

    if (options.noEmptyArrays && value.length === 0) {
      this.errorMessage = `Array is empty.`;
      return false;
    }

    if (this[_minLength] && value.length < this[_minLength]) {
      this.errorMessage = `Must have at least ${this[_minLength]} items.`;
      return false;
    }

    if (this[_maxLength] && value.length > this[_maxLength]) {
      this.errorMessage = `Must have at most ${this[_maxLength]} items.`;
      return false;
    }

    if (this[_exactLength] && value.length !== this[_exactLength]) {
      this.errorMessage = `Must have exactly ${this[_exactLength]} items.`;
      return false;
    }

    if (this[_type] !== undefined) {
      const errors = {};

      for (const index in value) {
        const valid = await this[_type].isValid(value[index], options);
        if (!valid) {
          errors[index] = this[_type].errorMessage;
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

    return true;
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