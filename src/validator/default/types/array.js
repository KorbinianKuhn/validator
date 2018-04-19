const { defaultToAny } = require("./../../../utils/lodash");
const { ANY } = require("./any");
const { validate, validateSync } = require("./../validation/array");
const { toObject } = require("./../../../utils/to-object");

class ARRAY extends ANY {
  constructor(type, options, defaults) {
    super(options, defaults);
    this._type = type;
    this._empty = defaultToAny(options.emptyArrays, defaults.emptyArrays, true);
  }

  options(options = {}) {
    const settings = {
      allowed: this._allowed,
      required: this._required,
      parse: this._parse,
      unique: this._unique,
      empty: this._empty,
      min: this._min,
      max: this._max,
      length: this._length,
      only: this._only,
      not: this._not
    };
    if (options.validation) {
      return Object.assign(settings, {
        defaultValue: this._default,
        message: this._message,
        itemSchema: this._type,
        func: this._func
      });
    } else {
      return Object.assign(settings, {
        type: "array",
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
        if (this._type === undefined) {
          return [];
        } else {
          return this._type.example();
        }
      } else {
        return this._example;
      }
    } else {
      this._example = example;
      return this;
    }
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

  empty(boolean) {
    this._empty = boolean;
    return this;
  }

  unique(boolean) {
    this._unique = boolean;
    return this;
  }

  toObject(options = {}) {
    const items = this._type ? this._type.toObject(options) : undefined;
    return toObject(Object.assign(this.options(), { items }), options);
  }
}

exports.ARRAY = ARRAY;
exports.ArrayFactory = (type, options, defaults) =>
  new ARRAY(type, options, defaults);
