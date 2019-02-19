import { isUndefined, isNull, isNotUndefined, toDate } from '../../../utils';
import { validateOnly, validateNot, validateFunctionSync, validateFunctionAsync } from './any';

export const validateDate = (
  value,
  { defaultValue, allowed, required, message, parse, utc, min, max, only, not, nullAsUndefined }
) => {
  if (isUndefined(value) || (nullAsUndefined && isNull(value))) {
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

  if (value === null) {
    throw message.get('not_null', { value });
  }

  const date = toDate(message, value, utc);

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

export const validateDateSync = (
  value,
  { defaultValue, allowed, required, message, parse, utc, min, max, only, not, func, nullAsUndefined }
) => {
  value = validateDate(value, {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    utc,
    min,
    max,
    only,
    not,
    nullAsUndefined
  });
  return validateFunctionSync(func, value);
};

export const validateDateAsync = async (
  value,
  { defaultValue, allowed, required, message, parse, utc, min, max, only, not, func, nullAsUndefined }
) => {
  value = validateDate(value, {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    utc,
    min,
    max,
    only,
    not,
    nullAsUndefined
  });
  return validateFunctionAsync(func, value);
};
