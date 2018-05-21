const {
  isUndefined,
  isNotUndefined,
  isBoolean
} = require('./../../../utils/lodash');
const {
  validateFunctionSync,
  validateFunctionAsync,
  validateOnly,
  validateNot,
  validateRequired
} = require('./any');

const FALSES = ['0', 0, 'false'];
const TRUES = ['1', 1, 'true'];

const validateBoolean = (
  value,
  { defaultValue, allowed, required, message, parse, not, only }
) => {
  if (isUndefined(value) && isNotUndefined(defaultValue)) {
    return defaultValue;
  }

  if (allowed && allowed.indexOf(value) !== -1) {
    return value;
  }

  validateRequired(value, required, message);

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

const validateSync = (
  value,
  { defaultValue, allowed, required, message, func, parse, not, only }
) => {
  value = validateBoolean(value, {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    not,
    only
  });
  return validateFunctionSync(func, value);
};

const validate = async (
  value,
  { defaultValue, allowed, required, message, func, parse, not, only }
) => {
  value = validateBoolean(value, {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    not,
    only
  });
  return validateFunctionAsync(func, value);
};

module.exports = {
  validate,
  validateSync,
  validateBoolean
};
