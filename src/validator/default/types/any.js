const { defaultTo } = require("./../../../utils/lodash");
const { toObject } = require("./../../../utils/to-object");
const { validate, validateSync } = require("./../validation/any");
const { isFunction } = require("./../../../utils/lodash");

class ANY {
  constructor(options, defaults) {
    this._message = defaultTo(options.message, defaults.message);
    this._type = defaultTo(options.type, defaults.type);
    this._required = defaultTo(
      options.requiredAsDefault,
      defaults.requiredAsDefault
    );
    this._parse = defaultTo(options.parseToType, defaults.parseToType);
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
        type: "any",
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

  required(required) {
    if (required !== undefined) {
      console.warn(
        this._message.deprecated(
          "required() with arguments",
          "required() and optional()"
        )
      );
      this._required = required;
    } else {
      this._required = true;
    }
    return this;
  }

  optional() {
    this._required = false;
    return this;
  }

  description(description) {
    this._description = description;
    return this;
  }

  example(example) {
    this._example = example;
    return this;
  }

  default(value) {
    this._default = value;
    return this;
  }

  parse(boolean) {
    this._parse = boolean;
    return this;
  }

  only(values) {
    this._only = values;
    return this;
  }

  not(values) {
    this._not = values;
    return this;
  }

  func(func) {
    if (!isFunction(func)) {
      throw this._message.error("not_a_function", {}, { configuration: true });
    }
    this._func = func;
    return this;
  }

  toObject(options = {}) {
    return toObject(this.options(), options);
  }
}

exports.ANY = ANY;
exports.AnyFactory = function(options, defaults) {
  return new ANY(options, defaults);
};
