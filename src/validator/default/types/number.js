const { isNumber, isInteger } = require("./../../../utils/lodash");
const { ANY } = require("./any");
const { validate, validateSync } = require("./../validation/number");

class NUMBER extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
    this._integer = false;
  }

  options(options = {}) {
    const settings = {
      required: this._required,
      parse: this._parse,
      only: this._only,
      not: this._not,
      min: this._min,
      max: this._max,
      less: this._less,
      greater: this._greater,
      positive: this._positive,
      negative: this._negative,
      integer: this._integer
    };
    if (options.validation) {
      return Object.assign(settings, {
        defaultValue: this._default,
        message: this._message,
        func: this._func
      });
    } else {
      return Object.assign(settings, {
        type: "number",
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

  integer() {
    this._integer = true;
    return this;
  }

  min(number) {
    this._min = number;
    return this;
  }

  max(number) {
    this._max = number;
    return this;
  }

  less(number) {
    this._less = number;
    return this;
  }

  greater(number) {
    this._greater = number;
    return this;
  }

  positive() {
    this._positive = true;
    return this;
  }

  negative() {
    this._negative = true;
    return this;
  }

  default(value) {
    if (this._integer) {
      if (!isInteger(value)) {
        throw this._message.error("invalid_default_value", {
          expected: "integer",
          actual: typeof value
        });
      }
    } else if (!isNumber(value)) {
      throw this._message.error("invalid_default_value", {
        expected: "number",
        actual: typeof value
      });
    }

    this._default = value;
    return this;
  }
}

exports.NUMBER = NUMBER;
exports.NumberFactory = (options, defaults) => new NUMBER(options, defaults);
