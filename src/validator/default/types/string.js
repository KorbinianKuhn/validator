const { defaultTo, isString, isRegExp } = require("./../../../utils/lodash");
const { ANY } = require("./any");
const { validate, validateSync } = require("./../validation/string");

class STRING extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
    this._empty = !defaultTo(options.noEmptyStrings, defaults.noEmptyStrings);
    this._trim = defaultTo(options.trimStrings, defaults.trimStrings);
  }

  options(options = {}) {
    const settings = {
      required: this._required,
      parse: this._parse,
      only: this._only,
      not: this._not,
      trim: this._trim,
      empty: this._empty,
      min: this._min,
      max: this._max,
      length: this._length,
      pattern: this._pattern
    };
    if (options.validation) {
      return Object.assign(settings, {
        defaultValue: this._default,
        message: this._message
      });
    } else {
      return Object.assign(settings, {
        type: "string",
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

  trim(boolean) {
    this._trim = boolean;
    return this;
  }

  regex(pattern) {
    if (!isRegExp(pattern)) {
      throw this._message.error("not_a_regular_expression", { value: pattern });
    }
    this._pattern = pattern;
    return this;
  }

  default(value) {
    if (!isString(value)) {
      throw this._message.error("invalid_default_value", {
        expected: "string",
        actual: value
      });
    }
    this._default = value;
    return this;
  }
}

exports.STRING = STRING;
exports.StringFactory = (options, defaults) => new STRING(options, defaults);
