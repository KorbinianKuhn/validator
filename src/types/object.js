const _ = require('lodash');
const BASE = require('./base');

const ALLOWED_CONDITIONS = ['gt', 'equals', 'lt', 'gte', 'lte'];

var _object = Symbol();
var _options = Symbol();
var _default = Symbol();
var _empty = Symbol();
var _conditions = Symbol();

const compare = (value, key, conditions) => {
  const errors = [];
  for (const method in conditions) {
    const a = _.at(value, key)[0];
    const b = _.at(value, conditions[method])[0];
    if (_.isObject(a) || _.isObject(b)) {
      continue;
    }
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
      case 'equals':
        if (!_.isEqual(a, b)) errors.push(`must equal '${conditions[method]}'`);
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
}

function ObjectFactory(object, options) {
  return new OBJECT(object, options);
}
module.exports = ObjectFactory;
