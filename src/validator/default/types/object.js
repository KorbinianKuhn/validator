const {
  defaultToAny,
  isPlainObject,
  isFunction,
  removeUndefinedProperties
} = require('./../../../utils/lodash');
const { ANY } = require('./any');
const { validate, validateSync } = require('./../validation/object');
const { toObject } = require('./../../../utils/to-object');

class OBJECT extends ANY {
  constructor(object = {}, options, defaults) {
    super(options, defaults);

    if (!isPlainObject(object)) {
      throw this._message.error('object_invalid_type');
    }

    this._object = object;
    this._conditions = [];
    this._empty = defaultToAny(
      options.emptyObjects,
      defaults.emptyObjects,
      true
    );
    this._unknown = defaultToAny(
      options.unknownObjectKeys,
      defaults.unknownObjectKeys,
      true
    );
  }

  options(options = {}) {
    const settings = {
      allowed: this._allowed,
      required: this._required,
      parse: this._parse,
      only: this._only,
      not: this._not,
      min: this._min,
      max: this._max,
      length: this._length,
      empty: this._empty,
      unknown: this._unknown
    };
    if (options.validation) {
      return removeUndefinedProperties({
        ...settings,
        defaultValue: this._default,
        message: this._message,
        object: this._object,
        func: this._func,
        conditions: this._conditions
      });
    } else {
      return removeUndefinedProperties({
        ...settings,
        type: 'object',
        description: this._description,
        example: this.example(),
        default: this._default
      });
    }
  }

  async validate(value) {
    return validate(value, this.options({ validation: true }));
  }

  validateSync(value) {
    return validateSync(value, this.options({ validation: true }));
  }

  example(example) {
    if (example === undefined) {
      if (this._example === undefined) {
        const example = {};
        for (const key in this._object) {
          example[key] = this._object[key].example();
        }
        return example;
      } else {
        return this._example;
      }
    } else {
      this._example = example;
      return this;
    }
  }

  empty(boolean) {
    this._empty = boolean;
    return this;
  }

  gt(a, b) {
    this._conditions.push({ keyA: a, keyB: b, method: 'gt' });
    return this;
  }

  gte(a, b) {
    this._conditions.push({ keyA: a, keyB: b, method: 'gte' });
    return this;
  }

  lt(a, b) {
    this._conditions.push({ keyA: a, keyB: b, method: 'lt' });
    return this;
  }

  lte(a, b) {
    this._conditions.push({ keyA: a, keyB: b, method: 'lte' });
    return this;
  }

  equals(a, b) {
    this._conditions.push({ keyA: a, keyB: b, method: 'equals' });
    return this;
  }

  notEquals(a, b) {
    this._conditions.push({ keyA: a, keyB: b, method: 'notEquals' });
    return this;
  }

  dependsOn(a, b) {
    this._conditions.push({ keyA: a, keyB: b, method: 'dependsOn' });
    return this;
  }

  xor(a, b) {
    this._conditions.push({ keyA: a, keyB: b, method: 'xor' });
    return this;
  }

  or(a, b) {
    this._conditions.push({ keyA: a, keyB: b, method: 'or' });
    return this;
  }

  func(fn, ...keys) {
    if (!isFunction(fn)) {
      throw this._message.error('invalid_function');
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

  unknown(boolean) {
    this._unknown = boolean;
    return this;
  }

  toObject(options = {}) {
    const properties = {};
    for (const key in this._object) {
      properties[key] = this._object[key].toObject(options);
    }
    return toObject({ ...this.options(), properties }, options);
  }

  // TODO rename
  // rename(source, target) {
  //   return this;
  // }
}

exports.OBJECT = OBJECT;
exports.ObjectFactory = (schema, options = {}, defaults = {}) =>
  new OBJECT(schema, options, defaults);
