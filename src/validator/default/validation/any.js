const {
  isUndefined,
  isNotUndefined,
  defaultTo,
  isNil
} = require("./../../../utils/lodash");
const { getErrorMessage } = require("./../../../utils/error");

const validateRequired = (value, required, message) => {
  if (isNil(value) && required) {
    throw message.get("required", { value });
  }
};

const validateAny = (
  value,
  { defaultValue, allowed, required, message, not, only }
) => {
  if (isUndefined(value) && isNotUndefined(defaultValue)) {
    return defaultValue;
  }

  if (allowed && allowed.indexOf(value) !== -1) {
    return value;
  }

  validateRequired(value, required, message);
  validateOnly(only, value, message);
  validateNot(not, value, message);

  return value;
};

const validateFunctionSync = (func, value) => {
  if (func) {
    try {
      return defaultTo(func(value), value);
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
    return defaultTo(result, value);
  } else {
    return value;
  }
};

const validateOnly = (only, value, message) => {
  if (only && only.indexOf(value) === -1) {
    throw message.get("only", { value, only: only.join(", ") });
  }
};

const validateNot = (not, value, message) => {
  if (not && not.indexOf(value) !== -1) {
    throw message.get("not", { value, not: not.join(", ") });
  }
};

const validateSync = (
  value,
  { defaultValue, allowed, required, message, not, only, func }
) => {
  value = validateAny(value, {
    defaultValue,
    allowed,
    required,
    message,
    not,
    only
  });
  return validateFunctionSync(func, value);
};

const validate = async (
  value,
  { defaultValue, allowed, required, message, not, only, func }
) => {
  value = validateAny(value, {
    defaultValue,
    allowed,
    required,
    message,
    not,
    only
  });
  return validateFunctionAsync(func, value);
};

module.exports = {
  validate,
  validateSync,
  validateAny,
  validateRequired,
  validateFunctionSync,
  validateFunctionAsync,
  validateOnly,
  validateNot
};
