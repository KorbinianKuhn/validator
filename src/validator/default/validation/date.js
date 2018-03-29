const { isNil } = require("./../../../utils/lodash");
const moment = require("moment");
const { validateFunctionSync, validateFunctionAsync } = require("./any");

const validateDate = (
  value,
  defaultValue,
  required,
  message,
  parse,
  utc,
  format,
  strict,
  min,
  max
) => {
  if (isNil(value)) {
    if (defaultValue) {
      return defaultValue;
    } else if (required) {
      throw message.get("required", { value });
    } else {
      return value;
    }
  }

  const date = utc
    ? moment.utc(date, format, strict)
    : moment(date, format, strict);

  if (!date.isValid()) {
    throw message.get("date", "invalid", format);
  }

  if (min && date.toDate() < min) {
    throw message.get("date_min", { expected: min.toISOString() });
  }

  if (max && date.toDate() > max) {
    throw message.get("date_max", { expected: max.toISOString() });
  }

  if (parse) {
    value = date.toDate();
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
    utc,
    format,
    strict,
    min,
    max,
    func
  }
) => {
  value = validateDate(
    value,
    defaultValue,
    required,
    message,
    parse,
    utc,
    format,
    strict,
    min,
    max
  );
  return validateFunctionSync(func, value);
};

const validate = async (
  value,
  {
    defaultValue,
    required,
    message,
    parse,
    utc,
    format,
    strict,
    min,
    max,
    func
  }
) => {
  value = validateDate(
    value,
    defaultValue,
    required,
    message,
    parse,
    utc,
    format,
    strict,
    min,
    max
  );
  return validateFunctionAsync(func, value);
};

module.exports = {
  validate,
  validateSync,
  validateDate
};
