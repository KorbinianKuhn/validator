const _ = require('lodash');
const BASE = require('./base');

var _private = Symbol();

class ARRAY extends BASE {
  constructor(type, options) {
    super();
    this[_private] = {};
    this[_private].type = type;
    this[_private].options = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_private].options, options);

    if (_.isNil(value)) {
      if (this[_private].default) return this[_private].default;
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

    if (value.length === 0 && (this[_private].empty === false || (this[_private].empty === undefined && options.noEmptyArrays))) {
      throw `Array is empty.`;
    }

    if (this[_private].min && value.length < this[_private].min) {
      throw `Must have at least ${this[_private].min} items.`;
    }

    if (this[_private].max && value.length > this[_private].max) {
      throw `Must have at most ${this[_private].max} items.`;
    }

    if (this[_private].length && value.length !== this[_private].length) {
      throw `Must have exactly ${this[_private].length} items.`;
    }

    if (this[_private].unique && _.uniqWith(value, _.isEqual).length !== value.length) {
      throw 'Values must be unique.';
    }

    if (this[_private].type !== undefined) {
      const errors = {};

      for (const index in value) {
        try {
          value[index] = await this[_private].type.validate(value[index], options);
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

  min(length) {
    this[_private].min = length;
    return this;
  }

  max(length) {
    this[_private].max = length;
    return this;
  }

  length(length) {
    this[_private].length = length;
    return this;
  }

  empty(boolean) {
    this[_private].empty = boolean;
    return this;
  }

  default (value) {
    if (!_.isArray(value)) {
      throw new Error('Must be array.');
    }
    this[_private].default = value;
    return this;
  }

  unique(boolean) {
    this[_private].unique = boolean;
    return this;
  }

  // Deprecated remove in v1
  defaultValue(value) {
    console.log('express-input-validator: using defaultValue() is deprecated. Use default() instead.');
    return this.default(value);
  }

  minLength(length) {
    console.log('express-input-validator: using minLength() is deprecated. Use min() instead.');
    return this.min(length);
  }

  maxLength(length) {
    console.log('express-input-validator: using maxLength() is deprecated. Use max() instead.');
    return this.max(length);
  }

  exactLength(length) {
    console.log('express-input-validator: using exactLength() is deprecated. Use length() instead.');
    return this.length(length);
  }
}

function NewArray(type, options) {
  return new ARRAY(type, options);
}
module.exports = NewArray;
