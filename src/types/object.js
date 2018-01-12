const _ = require('lodash');
const BASE = require('./base');

const ALLOWED_CONDITIONS = ['gt', 'equals', 'lt', 'gte', 'lte', 'notEquals', 'dependsOn', 'xor'];

var _object = Symbol();
var _options = Symbol();
var _default = Symbol();
var _empty = Symbol();
var _conditions = Symbol();
var _private = Symbol();

const compare = (value, keyA, conditions) => {
  const errors = [];
  for (const method in conditions) {
    const keyB = conditions[method];
    const a = _.at(value, keyA)[0];
    const b = _.at(value, conditions[method])[0];

    if (['gt', 'lt', 'gte', 'lte'].indexOf(method) !== -1) {
      if (_.isObject(a) || _.isObject(b)) {
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
        if (a && b) errors.push(`only '${keyA}' or '${keyB}' can be set`);
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

    this[_object] = object;
    this[_options] = options || {};
    this[_private] = {};
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

    if (this[_conditions] && _.keys(errors).length === 0) {
      for (const key in this[_conditions]) {
        try {
          compare(value, key, this[_conditions][key]);
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

  conditions(options) {
    let conditions = {}
    if (this[_conditions]) {
      conditions = this[_conditions];
    }
    for (const key in options) {
      if (!_.has(this[_object], key)) throw `Object has no key '${key}'.`;
      for (const method in options[key]) {
        if (ALLOWED_CONDITIONS.indexOf(method) === -1) throw `Object has no condition method '${method}'.`;
        if (!_.has(this[_object], options[key][method])) throw `Object has no key '${options[key][method]}'.`;
        if (_.has(conditions, key)) {
          _.merge(conditions[key], options[key]);
        } else {
          conditions[key] = options[key];
        }
      }
    }
    this[_conditions] = conditions;
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
}

function ObjectFactory(object, options) {
  return new OBJECT(object, options);
}
module.exports = ObjectFactory;
