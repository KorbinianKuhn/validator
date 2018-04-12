const { isNil, isNotNil } = require("./../../../utils/lodash");
const moment = require("moment");
const {
  validateFunctionSync,
  validateFunctionAsync,
  validateOnly,
  validateNot,
  validateRequired
} = require("./any");

const validateDate = (
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
    only,
    not
  }
) => {
  if (isNil(value) && isNotNil(defaultValue)) {
    return defaultValue;
  }

  validateRequired(value, required, message);

  const date = utc
    ? moment.utc(value, format, strict)
    : moment(value, format, strict);

  if (!date.isValid()) {
    throw message.error("date_invalid", { format });
  }

  if (min && date.toISOString() < min) {
    throw message.error("date_min", { min });
  }

  if (max && date.toISOString() > max) {
    throw message.error("date_max", { max });
  }

  validateOnly(only, value, message);
  validateNot(not, value, message);

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
    only,
    not,
    func
  }
) => {
  value = validateDate(value, {
    defaultValue,
    required,
    message,
    parse,
    utc,
    format,
    strict,
    min,
    max,
    only,
    not
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
    utc,
    format,
    strict,
    min,
    max,
    only,
    not,
    func
  }
) => {
  value = validateDate(value, {
    defaultValue,
    required,
    message,
    parse,
    utc,
    format,
    strict,
    min,
    max,
    only,
    not
  });
  return validateFunctionAsync(func, value);
};

module.exports = {
  validate,
  validateSync,
  validateDate
};
