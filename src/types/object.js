const _ = require('lodash');
const BASE = require('./base');
const message = require('../message');
const helper = require('../helper');

const _private = Symbol('Private variables');

const ALLOWED_CONDITIONS = ['gt', 'equals', 'lt', 'gte', 'lte', 'notEquals', 'dependsOn', 'xor'];

const validateObject = async (value, privates, options) => {
  if (_.isNil(value)) {
    if (privates.default) return privates.default;
    if (privates.required) throw message.required(options.language, options.type, value);
    return value;
  }

  if (options.parseToType && _.isString(value)) {
    try {
      value = JSON.parse(value);
    } catch (err) {
      // Do nothing
    }
  }

  if (!_.isPlainObject(value)) throw message.get(options.language, options.type, 'object', 'wrong_type');

  const length = _.keys(value).length;
  if (length === 0 && (privates.empty === false || (privates.empty === undefined && options.noEmptyObjects))) {
    throw message.get(options.language, options.type, 'object', 'empty');
  }

  if (privates.min && length < privates.min) throw message.get(options.language, options.type, 'object', 'min', privates.min);
  if (privates.max && length > privates.max) throw message.get(options.language, options.type, 'object', 'max', privates.max);
  if (privates.length && length !== privates.length) throw message.get(options.language, options.type, 'object', 'length', privates.length);

  const errors = {};
  for (const key in privates.object) {
    try {
      const result = await privates.object[key].validate(value[key], options);
      if (!_.isNil(result)) value[key] = result;
    } catch (err) {
      errors[key] = err;
    }
  }

  if (options.noUndefinedKeys) {
    for (const key in value) {
      if (!_.has(privates.object, key)) {
        errors[key] = message.get(options.language, options.type, 'object', 'unknown', key);
      }
    }
  }

  if (privates.conditions && _.keys(errors).length === 0) {
    for (const key in privates.conditions) {
      try {
        compare(value, key, privates.conditions[key], options);
      } catch (err) {
        errors[key] = err;
      }
    }
  }

  if (privates.func) {
    const fn = privates.func.fn;
    const keys = privates.func.keys;
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
};

const compare = (value, keyA, conditions, options) => {
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
            if (!(a > b)) errors.push(message.get(options.language, options.type, 'object', 'gt', keyB, keyA));
            break;
          case 'gte':
            if (!(a >= b)) errors.push(message.get(options.language, options.type, 'object', 'gte', keyB, keyA));
            break;
          case 'lt':
            if (!(a < b)) errors.push(message.get(options.language, options.type, 'object', 'lt', keyB, keyA));
            break;
          case 'lte':
            if (!(a <= b)) errors.push(message.get(options.language, options.type, 'object', 'lte', keyB, keyA));
            break;
        }
        continue;
      }
    }

    switch (method) {
      case 'equals':
        if (!_.isEqual(a, b)) errors.push(message.get(options.language, options.type, 'object', 'equals', keyB, keyA));
        break;
      case 'notEquals':
        if (_.isEqual(a, b)) errors.push(message.get(options.language, options.type, 'object', 'not_equals', keyB, keyA));
        break;
      case 'xor':
        errors.push(message.get(options.language, options.type, 'object', 'xor', keyB, keyA));
        break;
      case 'dependsOn':
        if (a && !b) errors.push(message.get(options.language, options.type, 'object', 'depends_on', keyB, keyA));
        break;
    }
  }

  if (errors.length > 0) {
    throw errors.join(', ');
  }
};

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

    const func = validateObject(value, {
      required: this.isRequired(options),
      default: this[_private].default,
      empty: this[_private].empty,
      min: this[_private].min,
      max: this[_private].max,
      length: this[_private].length,
      object: this[_private].object,
      conditions: this[_private].conditions,
      func: this[_private].func
    }, options);

    return helper.validate(options.type, func);
  }

  empty(boolean) {
    this[_private].empty = boolean;
    return this;
  }

  conditions(options) {
    let conditions = {};
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
      throw new Error('Is not a function.');
    }

    this[_private].func = {
      fn,
      keys
    };
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

  default(value) {
    if (!_.isPlainObject(value)) {
      throw new Error('Must be an object.');
    }
    this[_private].default = value;
    return this;
  }
}

function ObjectFactory(object, options) {
  return new OBJECT(object, options);
}
module.exports = ObjectFactory;
