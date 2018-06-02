const { isUndefined, isNotUndefined } = require('./../../../utils/lodash');
const { toMomentDate } = require('./../../../utils/date');
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
    strict,
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

  const momentDate = toMomentDate(message, value, utc, format, strict);

  if (min && momentDate.toISOString() < min) {
    throw message.get('date_min', { min });
  }

  if (max && momentDate.toISOString() > max) {
    throw message.get('date_max', { max });
  }

  validateOnly(only, value, message);
  validateNot(not, value, message);

  if (parse) {
    value = momentDate.toDate();
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
