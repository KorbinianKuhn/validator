const _ = require("./../../utils/lodash");
const { Validator } = require("./../default/validator");
const { AnyFactory } = require("./types/any");
const { ArrayFactory } = require("./types/array");
const { BooleanFactory } = require("./types/boolean");
const { DateFactory } = require("./types/date");
const { NumberFactory } = require("./types/number");
const { ObjectFactory } = require("./types/object");
const { StringFactory } = require("./types/string");

const TYPES = [
  "ANY_ANGULAR",
  "ARRAY_ANGULAR",
  "BOOLEAN_ANGULAR",
  "DATE_ANGULAR",
  "NUMBER_ANGULAR",
  "OBJECT_ANGULAR",
  "STRING_ANGULAR"
];

class AngularValidator extends Validator {
  constructor(options) {
    options.messages = "angular";
    options.type = "angular";
    super(options);
    this._types = TYPES;
  }

  addType(name, type) {
    if (_.has(this._customs, name)) {
      // TODO correct error message
      throw new Error(
        `Error adding custom type. Name '${name}' is already set.`
      );
    }

    this._customs[name] = _.cloneDeep(type);
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

exports.AngularValidatorFactory = (options = {}) =>
  new AngularValidator(options);
