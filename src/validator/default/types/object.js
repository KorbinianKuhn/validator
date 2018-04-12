const {
  defaultTo,
  isPlainObject,
  set,
  has,
  merge,
  isFunction
} = require("./../../../utils/lodash");
const { ANY } = require("./any");
const { validate, validateSync } = require("./../validation/object");
const { toObject } = require("./../../../utils/to-object");

const ALLOWED_CONDITIONS = [
  "gt",
  "equals",
  "lt",
  "gte",
  "lte",
  "notEquals",
  "dependsOn",
  "xor"
];

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
    this._conditions = {};
    this._empty = !defaultTo(options.noEmptyObjects, defaults.noEmptyObjects);
    this._noUndefinedKeys = defaultTo(
      options.noUndefinedKeys,
      defaults.noUndefinedKeys
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
      noUndefinedKeys: this._noUndefinedKeys
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

  conditions(options) {
    for (const key in options) {
      if (!has(this._object, key)) throw `Object has no key '${key}'.`;
      for (const method in options[key]) {
        if (ALLOWED_CONDITIONS.indexOf(method) === -1)
          throw `Object has no condition method '${method}'.`;
        if (!has(this._object, options[key][method]))
          throw `Object has no key '${options[key][method]}'.`;
        if (has(this._conditions, key)) {
          merge(this._conditions[key], options[key]);
        } else {
          this._conditions[key] = options[key];
        }
      }
    }
    return this;
  }

  gt(a, b) {
    return this.conditions(set({}, `${a}.gt`, b));
  }

  gte(a, b) {
    return this.conditions(set({}, `${a}.gte`, b));
  }

  lt(a, b) {
    return this.conditions(set({}, `${a}.lt`, b));
  }

  lte(a, b) {
    return this.conditions(set({}, `${a}.lte`, b));
  }

  equals(a, b) {
    return this.conditions(set({}, `${a}.equals`, b));
  }

  notEquals(a, b) {
    return this.conditions(set({}, `${a}.notEquals`, b));
  }

  dependsOn(a, b) {
    return this.conditions(set({}, `${a}.dependsOn`, b));
  }

  xor(a, b) {
    return this.conditions(set({}, `${a}.xor`, b));
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
