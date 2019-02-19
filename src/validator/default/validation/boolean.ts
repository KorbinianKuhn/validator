import { isUndefined, isNull, isNotUndefined, isBoolean } from '../../../utils';
import { validateOnly, validateNot, validateFunctionSync, validateFunctionAsync } from './any';

const FALSES = ['0', 0, 'false'];
const TRUES = ['1', 1, 'true'];

export const validateBoolean = (
  value,
  { defaultValue, allowed, required, message, parse, not, only, nullAsUndefined }
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

  if (parse) {
    if (TRUES.indexOf(value) !== -1) {
      return true;
    } else if (FALSES.indexOf(value) !== -1) {
      return false;
    }
  }

  validateOnly(only, value, message);
  validateNot(not, value, message);

  if (!isBoolean(value)) {
    throw message.get('wrong_type', {
      expected: 'boolean',
      actual: typeof value
    });
  }

  return value;
};

export const validateBooleanSync = (
  value,
  { defaultValue, allowed, required, message, func, parse, not, only, nullAsUndefined }
) => {
  value = validateBoolean(value, {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    not,
    only,
    nullAsUndefined
  });
  return validateFunctionSync(func, value);
};

export const validateBooleanAsync = async (
  value,
  { defaultValue, allowed, required, message, func, parse, not, only, nullAsUndefined }
) => {
  value = validateBoolean(value, {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    not,
    only,
    nullAsUndefined
  });
  return validateFunctionAsync(func, value);
};
