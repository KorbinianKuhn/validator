const { isBoolean } = require("./../../../utils/lodash");
const { ANY } = require("./any");
const { validate, validateSync } = require("./../validation/boolean");

class BOOLEAN extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
  }

  options(options = {}) {
    const settings = {
      required: this._required,
      parse: this._parse,
      only: this._only,
      not: this._not
    };
    if (options.validation) {
      return Object.assign(settings, {
        defaultValue: this._default,
        message: this._message,
        func: this._func
      });
    } else {
      return Object.assign(settings, {
        type: "boolean",
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

  default(value) {
    if (!isBoolean(value)) {
      throw this._message.error(
        "invalid_default_value",
        {
          expected: "boolean",
          actual: typeof value
        },
        { configuration: true }
      );
    }
    this._default = value;
    return this;
  }
}

exports.BOOLEAN = BOOLEAN;
exports.BooleanFactory = (options, defaults) => new BOOLEAN(options, defaults);
