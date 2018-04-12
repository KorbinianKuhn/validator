const {
  defaultToAny,
  isPlainObject,
  isFunction
} = require("./../../../utils/lodash");
const { ANY } = require("./any");
const { validate, validateSync } = require("./../validation/object");
const { toObject } = require("./../../../utils/to-object");

class OBJECT extends ANY {
  constructor(object, options, defaults) {
    super(options, defaults);

    if (object === undefined) {
      throw this._message.error("object_missing");
    }

    if (!isPlainObject(object)) {
      throw this._message.error("object_invalid_type");
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
      return Object.assign(settings, {
        defaultValue: this._default,
        message: this._message,
        object: this._object
      });
    } else {
      return Object.assign(settings, {
        type: "object",
        description: this._description,
        example: this._example,
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

  empty(boolean) {
    this._empty = boolean;
    return this;
  }

  gt(a, b) {
    return this.conditions.push({ keyA: a, keyB: b, method: "gt" });
  }

  gte(a, b) {
    return this.conditions.push({ keyA: a, keyB: b, method: "gte" });
  }

  lt(a, b) {
    return this.conditions.push({ keyA: a, keyB: b, method: "lt" });
  }

  lte(a, b) {
    return this.conditions.push({ keyA: a, keyB: b, method: "lte" });
  }

  equals(a, b) {
    return this.conditions.push({ keyA: a, keyB: b, method: "equals" });
  }

  notEquals(a, b) {
    return this.conditions.push({ keyA: a, keyB: b, method: "notEquals" });
  }

  dependsOn(a, b) {
    return this.conditions.push({ keyA: a, keyB: b, method: "dependsOn" });
  }

  xor(a, b) {
    return this.conditions.push({ keyA: a, keyB: b, method: "xor" });
  }

  or(a, b) {
    return this.conditions.push({ keyA: a, keyB: b, method: "or" });
  }

  func(fn, ...keys) {
    if (!isFunction(fn)) {
      throw this._message.error("not_a_function");
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
    if (!isPlainObject(value)) {
      throw this._message.error("not_an_object");
    }
    this._default = value;
    return this;
  }

  toObject(options = {}) {
    const properties = {};
    for (const key in this._object) {
      properties[key] = this._object[key].toObject(options);
    }
    return toObject(Object.assign(this.options(), { properties }), options);
  }
}

exports.OBJECT = OBJECT;
exports.ObjectFactory = (schema, options, defaults) =>
  new OBJECT(schema, options, defaults);
