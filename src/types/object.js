const _ = require('lodash');
const BASE = require('./base');

const ALLOWED_CONDITIONS = ['gt', 'equals', 'lt', 'gte', 'lte', 'notEquals', 'dependsOn', 'xor'];

var _private = Symbol();

const compare = (value, keyA, conditions) => {
  const errors = [];
  for (const method in conditions) {
    const keyB = conditions[method];
    const a = _.at(value, keyA)[0];
    const b = _.at(value, conditions[method])[0];

    if (method !== 'dependsOn' && (!a || !b)) {
      continue;
    }

    if (['gt', 'lt', 'gte', 'lte'].indexOf(method) !== -1) {
      if (_.isPlainObject(a) || _.isPlainObject(b)) {
        continue;
      } else {
        switch (method) {
          case 'gt':
            if (!(a > b)) errors.push(`must be greater then '${conditions[method]}'`);
            break;
          case 'gte':
            if (!(a >= b)) errors.push(`must be greater or equal then '${conditions[method]}'`);
            break;
          case 'lt':
            if (!(a < b)) errors.push(`must be less then '${conditions[method]}'`);
            break;
          case 'lte':
            if (!(a <= b)) errors.push(`must be less or equal then '${conditions[method]}'`);
            break;
        }
        continue;
      }
    }

    switch (method) {
      case 'equals':
        if (!_.isEqual(a, b)) errors.push(`must equal '${conditions[method]}'`);
        break;
      case 'notEquals':
        if (_.isEqual(a, b)) errors.push(`must not equal '${conditions[method]}'`);
        break;
      case 'xor':
        errors.push(`only '${keyA}' or '${keyB}' can be set`);
        break;
      case 'dependsOn':
        if (a && !b) errors.push(`depends on '${keyB}'`);
        break;
    }

  }

  if (errors.length > 0) {
    throw errors.join(', ');
  }
}

class OBJECT extends BASE {
  constructor(object, options) {
    super();

    if (object === undefined) {
      throw new Error('Missing object.');
    }

    if (!_.isPlainObject(object)) {
      throw new Error('Invalid object.');
    }

    this[_private] = {};
    this[_private].object = object;
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
      } catch (err) {}
    }

    if (!_.isPlainObject(value)) {
      throw `Must be object.`;
    }

    const length = _.keys(value).length
    if (length === 0 && (this[_private].empty === false || (this[_private].empty === undefined && options.noEmptyObjects))) {
      throw `Object is empty.`;
    }

    if (this[_private].min && length < this[_private].min) {
      throw `Object must have at least ${this[_private].min} keys.`
    }

    if (this[_private].max && length > this[_private].max) {
      throw `Object must have at most ${this[_private].max} keys.`
    }

    if (this[_private].length && length !== this[_private].length) {
      throw `Object must have exactly ${this[_private].length} keys.`
    }

    const errors = {}
    for (const key in this[_private].object) {
      try {
        const result = await this[_private].object[key].validate(value[key], options);
        if (!_.isNil(result)) value[key] = result;
      } catch (err) {
        errors[key] = err;
      }
    }

    if (options.noUndefinedKeys) {
      for (const key in value) {
        if (!_.has(this[_private].object, key)) {
          errors[key] = 'Invalid key.'
        }
      }
    }

    if (this[_private].conditions && _.keys(errors).length === 0) {
      for (const key in this[_private].conditions) {
        try {
          compare(value, key, this[_private].conditions[key]);
        } catch (err) {
          errors[key] = err;
        }
      }
    }

    if (this[_private].func) {
      const fn = this[_private].func.fn;
      const keys = this[_private].func.keys;
      const values = [];
      for (const key of keys) {
        values.push(_.get(value, key, null));
      }
      try {
        await fn(...values);
      } catch (err) {
        errors[keys.join(', ')] = err;
      }
    }

    if (_.keys(errors).length > 0) {
      throw errors;
    } else {
      return value;
    }
  }

  empty(boolean) {
    this[_private].empty = boolean;
    return this;
  }

  conditions(options) {
    let conditions = {}
    if (this[_private].conditions) {
      conditions = this[_private].conditions;
    }
    for (const key in options) {
      if (!_.has(this[_private].object, key)) throw `Object has no key '${key}'.`;
      for (const method in options[key]) {
        if (ALLOWED_CONDITIONS.indexOf(method) === -1) throw `Object has no condition method '${method}'.`;
        if (!_.has(this[_private].object, options[key][method])) throw `Object has no key '${options[key][method]}'.`;
        if (_.has(conditions, key)) {
          _.merge(conditions[key], options[key]);
        } else {
          conditions[key] = options[key];
        }
      }
    }
    this[_private].conditions = conditions;
    return this;
  }

  gt(a, b) {
    return this.conditions(_.set({}, `${a}.gt`, b));
  }

  gte(a, b) {
    return this.conditions(_.set({}, `${a}.gte`, b));
  }

  lt(a, b) {
    return this.conditions(_.set({}, `${a}.lt`, b));
  }

  lte(a, b) {
    return this.conditions(_.set({}, `${a}.lte`, b));
  }

  equals(a, b) {
    return this.conditions(_.set({}, `${a}.equals`, b));
  }

  notEquals(a, b) {
    return this.conditions(_.set({}, `${a}.notEquals`, b));
  }

  dependsOn(a, b) {
    return this.conditions(_.set({}, `${a}.dependsOn`, b));
  }

  xor(a, b) {
    return this.conditions(_.set({}, `${a}.xor`, b));
  }

  func(fn, ...keys) {
    if (!_.isFunction(fn)) {
      throw new Error('Is not a function.')
    }

    this[_private].func = {
      fn,
      keys
    }
    return this;
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

  default (value) {
    if (!_.isPlainObject(value)) {
      throw new Error('Must be object.');
    }
    this[_private].default = value;
    return this;
  }

  // Deprecated remove in v1
  defaultValue(value) {
    console.log('using defaultValue() is deprecated. Use default() instead.');
    return this.default(value);
  }
}

function ObjectFactory(object, options) {
  return new OBJECT(object, options);
}
module.exports = ObjectFactory;
