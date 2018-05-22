const { isUndefined, isNotUndefined } = require('./../../../utils/lodash');
const { toDate, isValidDate } = require('./../../../utils/date');
const {
  validateFunctionSync,
  validateFunctionAsync,
  validateOnly,
  validateNot
} = require('./any');

const validateDate = (
  value,
  {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    utc,
    format,
    min,
    max,
    only,
    not
  }
) => {
  if (isUndefined(value)) {
    if (isNotUndefined(defaultValue)) {
      return defaultValue;
    }
    if (required) {
      throw message.get('required', { value });
    } else {
      return undefined;
    }
  }

  if (allowed && allowed.indexOf(value) !== -1) {
    return value;
  }

  console.log('here');
  const date = toDate(value, utc);
  console.log(date);

  if (!isValidDate(date)) {
    throw message.get('date_invalid', { format });
  }

  if (min && date.toISOString() < min) {
    throw message.get('date_min', { min });
  }

  if (max && date.toISOString() > max) {
    throw message.get('date_max', { max });
  }

  validateOnly(only, value, message);
  validateNot(not, value, message);

  if (parse) {
    value = date;
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
    allowed,
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
    allowed,
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
    allowed,
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
