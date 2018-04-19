const {
  isUndefined,
  isNotUndefined,
  isNull,
  isNumber,
  isString,
  isInteger
} = require("./../../../utils/lodash");
const {
  validateFunctionSync,
  validateFunctionAsync,
  validateOnly,
  validateNot,
  validateRequired
} = require("./any");

const validateNumber = (
  value,
  {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    min,
    max,
    less,
    greater,
    positive,
    negative,
    integer,
    only,
    not
  }
) => {
  if (isUndefined(value) && isNotUndefined(defaultValue)) {
    return defaultValue;
  }

  if (allowed && allowed.indexOf(value) !== -1) {
    return value;
  }

  validateRequired(value, required, message);

  if (parse && isString(value)) {
    if (integer && value.match(/^[+-]?\d+$/)) {
      value = parseInt(value);
    } else if (value.match(/^[-/+]?\d+(\.\d+)?$/)) {
      value = parseFloat(value);
    }
  }

  validateOnly(only, value, message);
  validateNot(not, value, message);

  if (integer) {
    if (!isInteger(value)) {
      if (isNumber(value)) {
        throw message.get("integer_is_number", { value, actual: "number" });
      } else {
        throw message.get("wrong_type", {
          expected: "integer",
          actual: typeof value
        });
      }
    }
  } else if (!isNumber(value)) {
    throw message.get("wrong_type", {
      expected: "number",
      actual: typeof value
    });
  }

  if (min && value < min) {
    throw message.get(integer ? "integer_min" : "number_min", {
      expected: min,
      actual: value
    });
  }

  if (max && value > max) {
    throw message.get(integer ? "integer_max" : "number_max", {
      expected: max,
      actual: value
    });
  }

  if (less && value >= less) {
    throw message.get(integer ? "integer_less" : "number_less", {
      expected: less,
      actual: value
    });
  }

  if (greater && value <= greater) {
    throw message.get(integer ? "integer_greater" : "number_greater", {
      expected: greater,
      actual: value
    });
  }

  if (positive && value <= 0) {
    throw message.get(integer ? "integer_positive" : "number_positive", {
      value
    });
  }

  if (negative && value >= 0) {
    throw message.get(integer ? "integer_negative" : "number_negative", {
      value
    });
  }

  return value;
};

const validateSync = (
  value,
  {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    min,
    max,
    less,
    greater,
    positive,
    negative,
    integer,
    only,
    not,
    func
  }
) => {
  value = validateNumber(value, {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    min,
    max,
    less,
    greater,
    positive,
    negative,
    integer,
    only,
    not
  });
  return validateFunctionSync(func, value);
};

const validate = async (
  value,
  {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    min,
    max,
    less,
    greater,
    positive,
    negative,
    integer,
    only,
    not,
    func
  }
) => {
  value = validateNumber(value, {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    min,
    max,
    less,
    greater,
    positive,
    negative,
    integer,
    only,
    not
  });
  return validateFunctionAsync(func, value);
};

module.exports = {
  validate,
  validateSync,
  validateNumber
};
