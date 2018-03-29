const { isNil, isAsyncFunction } = require("./../../../utils/lodash");

const validateAny = (value, defaultValue, required, message) => {
  if (isNil(value)) {
    if (defaultValue) {
      return defaultValue;
    } else if (required) {
      throw message.get("required", { value });
    }
  }

  return value;
};

const validateFunctionSync = (func, value) => {
  if (func) {
    try {
      const result = func(value);
      if (result) {
        return result;
      }
    } catch (err) {
      return err instanceof Error ? err.message : err;
    }
  }

  return value;
};

const validateFunctionAsync = async (func, value) => {
  if (func) {
    try {
      let result;
      if (isAsyncFunction(func)) {
        result = await func(value);
      } else {
        result = func(value);
      }

      if (result) {
        return result;
      }
    } catch (err) {
      return err instanceof Error ? err.message : err;
    }
  }

  return value;
};

const validateSync = (value, { defaultValue, required, message, func }) => {
  value = validateAny(value, defaultValue, required, message);
  return validateFunctionSync(func, value);
};

const validate = async (value, { defaultValue, required, message, func }) => {
  value = validateAny(value, defaultValue, required, message);
  return validateFunctionAsync(func, value);
};

module.exports = {
  validate,
  validateSync,
  validateAny,
  validateFunctionSync,
  validateFunctionAsync
};
