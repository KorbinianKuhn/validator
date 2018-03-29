const _ = require("./../../utils/lodash");
const { ValidationError } = require("./../../utils/error");
const { Message } = require("./../../utils/message");
const { VALIDATOR_OPTIONS } = require("./../default/settings");
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
    this._options = _.defaults(options, VALIDATOR_OPTIONS);
    this._customs = {};
    this._types = TYPES;
    this._message = Message(this._options.locale);
    this._options.message = this._message;
  }

  async validate(schema, data) {
    if (!_.hasIn(schema, "constructor.name")) {
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
    if (!_.hasIn(schema, "constructor.name")) {
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

  addType(name, type) {
    if (_.has(this._customs, name)) {
      throw this._message.error("duplicate_custom_type", { name });
    }

    if (this._types.indexOf(type.constructor.name) === -1) {
      throw this._message.error("invalid_custom_type", {
        name,
        type: type.constructor.name
      });
    }

    this._customs[name] = _.cloneDeep(type);
  }

  Custom(name) {
    if (!_.has(this._customs, name)) {
      throw this._message.error("unknown_custom_type", { name });
    } else {
      return _.cloneDeep(this._customs[name]);
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

  Enum(values, options = {}) {
    console.warn(this._message.deprecated("Enum()", "Any().only()"));
    return AnyFactory(values, options, this._options).only(values);
  }

  Function(func, options = {}) {
    console.warn(this._message.deprecated("Function()", "Any().func()"));
    return AnyFactory(options, this._options).func(func);
  }

  Integer(options = {}) {
    console.warn(this._message.deprecated("Integer()", "Number().integer()"));
    return NumberFactory(options, this._options).integer();
  }

  Number(options = {}) {
    return NumberFactory(options, this._options);
  }

  Object(schema, options = {}) {
    return ObjectFactory(schema, options, this._options);
  }

  Regex(regex, options = {}) {
    console.warn(this._message.deprecated("Regex()", "String().pattern()"));
    return StringFactory(options, this._options).pattern(regex);
  }

  String(options = {}) {
    return StringFactory(options, this._options);
  }
}

exports.Validator = Validator;
exports.ValidatorFactory = (options = {}) => new Validator(options);
