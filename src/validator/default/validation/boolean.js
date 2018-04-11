const { isNil, isBoolean } = require('./../../../utils/lodash');
const {
  validateFunctionSync,
  validateFunctionAsync,
  validateOnly,
  validateNot,
  validateRequired
} = require('./any');

const FALSES = ['0', 0, 'false'];
const TRUES = ['1', 1, 'true'];

const validateBoolean = ({
  value,
  defaultValue,
  required,
  message,
  parse,
  not,
  only
}) => {
  if (isNil(value) && !isNil(defaultValue)) {
    return defaultValue;
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
    throw message.error('wrong_type', { expected: 'boolean', actual: value });
  }

  return value;
};

const validateSync = (value, { defaultValue, required, message, func }) => {
  value = validateBoolean(value, defaultValue, required, message);
  return validateFunctionSync(func, value);
};

const validate = async (value, { defaultValue, required, message, func }) => {
  value = validateBoolean(value, defaultValue, required, message);
  return validateFunctionAsync(func, value);
};

module.exports = {
  validate,
  validateSync,
  validateBoolean
};
