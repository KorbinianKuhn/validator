const {
  defaultTo,
  defaults,
  cloneDeep,
  hasIn
} = require("./../../utils/lodash");
const { ValidationError } = require("./../../utils/error");
const { Message } = require("./../../utils/message");
const { VALIDATOR_OPTIONS } = require("./options");
const { AnyFactory } = require("./types/any");
const { ArrayFactory } = require("./types/array");
const { BooleanFactory } = require("./types/boolean");
const { DateFactory } = require("./types/date");
const { NumberFactory } = require("./types/number");
const { ObjectFactory } = require("./types/object");
const { StringFactory } = require("./types/string");

const TYPES = ["ANY", "ARRAY", "BOOLEAN", "DATE", "NUMBER", "OBJECT", "STRING"];

class Validator {
  constructor(options) {
    this._options = defaults(options, VALIDATOR_OPTIONS);
    this._customs = {};
    this._types = TYPES;
    this._message = Message(defaultTo(this._options.locale, "en"));
    this._options.message = this._message;
  }

  async validate(schema, data) {
    if (!hasIn(schema, "constructor.name")) {
      throw this._message.error("invalid_schema");
    }

    if (this._types.indexOf(schema.constructor.name) === -1) {
      throw this._message.error("unknown_schema");
    }

    try {
      return await schema.validate(data);
    } catch (err) {
      const error = new ValidationError(
        this._message.get("validation_error"),
        err
      );
      if (this._options.throwValidationErrors) {
        throw error;
      } else {
        return error;
      }
    }
  }

  validateSync(schema, data) {
    if (!hasIn(schema, "constructor.name")) {
      throw this._message.error("invalid_schema");
    }

    if (this._types.indexOf(schema.constructor.name) === -1) {
      throw this._message.error("unknown_schema");
    }

    try {
      return schema.validateSync(data);
    } catch (err) {
      const error = new ValidationError(
        this._message.get("validation_error"),
        err
      );
      if (this._options.throwValidationErrors) {
        throw error;
      } else {
        return error;
      }
    }
  }

  addLocale(name, messages) {
    this._message.addLocale(name, messages);
    return this;
  }

  setLocale(name) {
    this._message.setLocale(name);
    return this;
  }

  addType(name, type) {
    if (name in this._customs) {
      throw this._message.error("duplicate_custom_type", { name });
    }

    if (this._types.indexOf(type.constructor.name) === -1) {
      throw this._message.error("invalid_custom_type", {
        name,
        type: type.constructor.name
      });
    }

    this._customs[name] = cloneDeep(type);

    return this;
  }

  Custom(name) {
    if (name in this._customs) {
      return cloneDeep(this._customs[name]);
    } else {
      throw this._message.error("unknown_custom_type", { name });
    }
  }

  Any(type, options = {}) {
    return AnyFactory(options, this._options);
  }

  Array(type, options = {}) {
    return ArrayFactory(type, options, this._options);
  }

  Boolean(options = {}) {
    return BooleanFactory(options, this._options);
  }

  Date(options = {}) {
    return DateFactory(options, this._options);
  }

  Number(options = {}) {
    return NumberFactory(options, this._options);
  }

  Object(schema, options = {}) {
    return ObjectFactory(schema, options, this._options);
  }

  String(options = {}) {
    return StringFactory(options, this._options);
  }
}

exports.Validator = Validator;
exports.ValidatorFactory = (options = {}) => new Validator(options);
