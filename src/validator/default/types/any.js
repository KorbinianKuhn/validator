const {
  defaultToAny,
  removeUndefinedProperties
} = require('./../../../utils/lodash');
const { toObject } = require('./../../../utils/to-object');
const { validate, validateSync } = require('./../validation/any');
const { isFunction } = require('./../../../utils/lodash');
const { Message } = require('./../../../utils/message');

class ANY {
  constructor(options, defaults) {
    this._message = defaultToAny(
      options.message,
      defaults.message,
      Message('en')
    );
    this._required = defaultToAny(
      options.requiredAsDefault,
      defaults.requiredAsDefault,
      false
    );
    this._parse = defaultToAny(
      options.parseToType,
      defaults.parseToType,
      false
    );
  }

  options(options = {}) {
    const settings = {
      allowed: this._allowed,
      required: this._required,
      parse: this._parse,
      only: this._only,
      not: this._not
    };
    if (options.validation) {
      return removeUndefinedProperties({
        ...settings,
        defaultValue: this._default,
        message: this._message,
        func: this._func
      });
    } else {
      return removeUndefinedProperties({
        ...settings,
        type: 'any',
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

  required() {
    this._required = true;
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
    if (example === undefined) {
      return this._example !== undefined
        ? this._example
        : this._message.get('no_example');
    } else {
      this._example = example;
      return this;
    }
  }

  default(value) {
    this._default = value;
    return this;
  }

  parse(boolean) {
    this._parse = boolean;
    return this;
  }

  only(...values) {
    this._only = values;
    return this;
  }

  not(...values) {
    this._not = values;
    return this;
  }

  allow(...values) {
    this._allowed = values;
    return this;
  }

  func(func) {
    if (!isFunction(func)) {
      throw this._message.error('invalid_function', {});
    }
    this._func = func;
    return this;
  }

  toObject(options = {}) {
    return toObject(this.options(), options);
  }

  clone() {
    const obj = Object.create(Object.getPrototypeOf(this));
    Object.getOwnPropertyNames(this).forEach(key => {
      if (key === '_message') {
        obj._message = this._message;
      } else {
        obj[key] = JSON.parse(JSON.stringify(this[key]));
      }
    });
    return obj;
  }
}

exports.ANY = ANY;
exports.AnyFactory = (options = {}, defaults = {}) => {
  return new ANY(options, defaults);
};
