const _ = require('lodash');
const ANY = require('./any').ANY;
const message = require('../message');
const helper = require('../helper');

const ALLOWED_CONDITIONS = ['gt', 'equals', 'lt', 'gte', 'lte', 'notEquals', 'dependsOn', 'xor'];

const validateObject = async (value, schema) => {
  const language = schema._options.language;
  const messages = schema._options.messages;

  if (_.isNil(value)) {
    if (schema._default) return schema._default;
    if (schema._required) throw message.required(language, messages, value);
    return value;
  }

  if (schema._parse && _.isString(value)) {
    try {
      value = JSON.parse(value);
    } catch (err) {
      // Do nothing
    }
  }

  if (!_.isPlainObject(value)) throw message.get(language, messages, 'object', 'wrong_type');

  const length = _.keys(value).length;
  if (length === 0 && schema._empty) {
    throw message.get(language, messages, 'object', 'empty');
  }

  if (schema._min && length < schema._min) throw message.get(language, messages, 'object', 'min', schema._min);
  if (schema._max && length > schema._max) throw message.get(language, messages, 'object', 'max', schema._max);
  if (schema._length && length !== schema._length) throw message.get(language, messages, 'object', 'length', schema._length);

  const errors = {};
  for (const key in schema._object) {
    try {
      const result = await schema._object[key].validate(value[key]);
      if (!_.isNil(result)) value[key] = result;
    } catch (err) {
      errors[key] = err;
    }
  }

  if (schema._noUndefinedKeys) {
    for (const key in value) {
      if (!_.has(schema._object, key)) {
        errors[key] = message.get(language, messages, 'object', 'unknown', key);
      }
    }
  }

  if (schema._conditions && _.keys(errors).length === 0) {
    for (const key in schema._conditions) {
      try {
        compare(value, key, schema._conditions[key], language, messages);
      } catch (err) {
        errors[key] = err;
      }
    }
  }

  if (schema._func) {
    const fn = schema._func.fn;
    const keys = schema._func.keys;
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

const compare = (value, keyA, conditions, language, messages) => {
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
            if (!(a > b)) errors.push(message.get(language, messages, 'object', 'gt', keyB, keyA));
            break;
          case 'gte':
            if (!(a >= b)) errors.push(message.get(language, messages, 'object', 'gte', keyB, keyA));
            break;
          case 'lt':
            if (!(a < b)) errors.push(message.get(language, messages, 'object', 'lt', keyB, keyA));
            break;
          case 'lte':
            if (!(a <= b)) errors.push(message.get(language, messages, 'object', 'lte', keyB, keyA));
            break;
        }
        continue;
      }
    }

    switch (method) {
      case 'equals':
        if (!_.isEqual(a, b)) errors.push(message.get(language, messages, 'object', 'equals', keyB, keyA));
        break;
      case 'notEquals':
        if (_.isEqual(a, b)) errors.push(message.get(language, messages, 'object', 'not_equals', keyB, keyA));
        break;
      case 'xor':
        errors.push(message.get(language, messages, 'object', 'xor', keyB, keyA));
        break;
      case 'dependsOn':
        if (a && !b) errors.push(message.get(language, messages, 'object', 'depends_on', keyB, keyA));
        break;
    }
  }

  if (errors.length > 0) {
    throw errors.join(', ');
  }
};

class OBJECT extends ANY {
  constructor(object, options) {
    super(options);

    if (object === undefined) {
      throw new Error('Missing object.');
    }

    if (!_.isPlainObject(object)) {
      throw new Error('Invalid object.');
    }

    this._object = object;
    this._conditions = {};
    this._empty = !options.noEmptyObjects;
    this._noUndefinedKeys = options.noUndefinedKeys;
  }

  async validate(value) {
    return helper.validate(this._options.type, validateObject(value, this));
  }

  empty(boolean) {
    this._empty = boolean;
    return this;
  }

  conditions(options) {
    let conditions = {};
    if (this._conditions) {
      conditions = this._conditions;
    }
    for (const key in options) {
      if (!_.has(this._object, key)) throw `Object has no key '${key}'.`;
      for (const method in options[key]) {
        if (ALLOWED_CONDITIONS.indexOf(method) === -1) throw `Object has no condition method '${method}'.`;
        if (!_.has(this._object, options[key][method])) throw `Object has no key '${options[key][method]}'.`;
        if (_.has(conditions, key)) {
          _.merge(conditions[key], options[key]);
        } else {
          conditions[key] = options[key];
        }
      }
    }
    this._conditions = conditions;
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

    this._func = {
      fn,
      keys
    };
    return this;
  }

  min(length) {
    this._min = length;
    return this;
  }

  max(length) {
    this._max = length;
    return this;
  }

  length(length) {
    this._length = length;
    return this;
  }

  default(value) {
    if (!_.isPlainObject(value)) {
      throw new Error('Must be an object.');
    }
    this._default = value;
    return this;
  }

  toObject() {
    throw new Error('Not Implemented');
  }
}

exports.ObjectFactory = (options = {}) => new OBJECT(options);
