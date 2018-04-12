const { isNil, isNotNil, defaultTo } = require("./../../../utils/lodash");
const { getErrorMessage } = require("./../../../utils/error");

const validateRequired = (value, required, message) => {
  if (isNil(value) && required) {
    throw message.error("required", { value });
  }
};

const validateAny = (value, { defaultValue, required, message, not, only }) => {
  if (isNil(value) && isNotNil(defaultValue)) {
    return defaultValue;
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
    throw message.error("only", { value, only: only.join(", ") });
  }
};

const validateNot = (not, value, message) => {
  if (not && not.indexOf(value) !== -1) {
    throw message.error("not", { value, not: not.join(", ") });
  }
};

const validateSync = (
  value,
  { defaultValue, required, message, not, only, func }
) => {
  value = validateAny(value, { defaultValue, required, message, not, only });
  return validateFunctionSync(func, value);
};

const validate = async (
  value,
  { defaultValue, required, message, not, only, func }
) => {
  value = validateAny(value, { defaultValue, required, message, not, only });
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
