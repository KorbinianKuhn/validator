const { isNil, isString, isNotNil } = require("./../../../utils/lodash");
const {
  validateFunctionSync,
  validateFunctionAsync,
  validateOnly,
  validateNot,
  validateRequired
} = require("./any");

const validateString = (
  value,
  {
    defaultValue,
    required,
    message,
    trim,
    empty,
    min,
    max,
    length,
    pattern,
    not,
    only
  }
) => {
  if (isNil(value) && isNotNil(defaultValue)) {
    return defaultValue;
  }

  validateRequired(value, required, message);

  if (!isString(value)) {
    throw message.error("wrong_type", {
      expected: "string",
      actual: typeof value
    });
  }

  if (trim) {
    value = value.trim();
  }

  if (value === "" && empty === false) {
    throw message.error("string_empty");
  }

  validateOnly(only, value, message);
  validateNot(not, value, message);

  if (min || max || length) {
    const stringLength = value.length;
    if (min && stringLength < min) {
      throw message.error("string_min", {
        expected: min,
        actual: stringLength
      });
    }

    if (max && stringLength > max) {
      throw message.error("string_max", {
        expected: max,
        actual: stringLength
      });
    }

    if (length && stringLength !== length) {
      throw message.error("string_length", {
        expected: length,
        actual: stringLength
      });
    }
  }

  if (pattern && !value.match(pattern)) {
    // TODO throw custom message
    // throw schema._message[schema._language];
  }

  return value;
};

const validateSync = (
  value,
  {
    defaultValue,
    required,
    message,
    parse,
    trim,
    empty,
    min,
    max,
    length,
    pattern,
    not,
    only,
    func
  }
) => {
  value = validateString(value, {
    defaultValue,
    required,
    message,
    parse,
    trim,
    empty,
    min,
    max,
    length,
    pattern,
    not,
    only,
    func
  });
  return validateFunctionSync(func, value);
};

const validate = async (
  value,
  {
    defaultValue,
    required,
    message,
    parse,
    trim,
    empty,
    min,
    max,
    length,
    pattern,
    not,
    only,
    func
  }
) => {
  value = validateString(value, {
    defaultValue,
    required,
    message,
    parse,
    trim,
    empty,
    min,
    max,
    length,
    pattern,
    not,
    only,
    func
  });
  return validateFunctionAsync(func, value);
};

module.exports = {
  validate,
  validateSync,
  validateString
};
