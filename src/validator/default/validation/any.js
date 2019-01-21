const {
  isUndefined,
  isNotUndefined,
  defaultToAny,
  isNull
} = require('./../../../utils/lodash');
const { getErrorMessage } = require('./../../../utils/error');

const validateAny = (
  value,
  { defaultValue, allowed, required, message, not, only, nullAsUndefined }
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

  validateOnly(only, value, message);
  validateNot(not, value, message);

  return value;
};

const validateFunctionSync = (func, value) => {
  if (func) {
    try {
      return defaultToAny(func(value), value);
    } catch (err) {
      throw getErrorMessage(err);
    }
  }

  return value;
};

const validateFunctionAsync = async (func, value) => {
  if (func) {
    const result = await Promise.resolve(func(value)).catch(err => {
      throw getErrorMessage(err);
    });
    return defaultToAny(result, value);
  } else {
    return value;
  }
};

const validateOnly = (only, value, message) => {
  if (only && only.indexOf(value) === -1) {
    throw message.get('only', { value, only: only.join(', ') });
  }
};

const validateNot = (not, value, message) => {
  if (not && not.indexOf(value) !== -1) {
    throw message.get('not', { value, not: not.join(', ') });
  }
};

const validateSync = (
  value,
  { defaultValue, allowed, required, message, not, only, func, nullAsUndefined }
) => {
  value = validateAny(value, {
    defaultValue,
    allowed,
    required,
    message,
    not,
    only,
    nullAsUndefined
  });
  return validateFunctionSync(func, value);
};

const validate = async (
  value,
  { defaultValue, allowed, required, message, not, only, func, nullAsUndefined }
) => {
  value = validateAny(value, {
    defaultValue,
    allowed,
    required,
    message,
    not,
    only,
    nullAsUndefined
  });
  return validateFunctionAsync(func, value);
};

module.exports = {
  validate,
  validateSync,
  validateAny,
  validateFunctionSync,
  validateFunctionAsync,
  validateOnly,
  validateNot
};
