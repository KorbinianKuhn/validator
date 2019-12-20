const {
  isUndefined,
  isNotUndefined,
  isBoolean,
  isNull,
  clone
} = require('./../../../utils/lodash');
const {
  validateFunctionSync,
  validateFunctionAsync,
  validateOnly,
  validateNot
} = require('./any');

const FALSES = ['0', 0, 'false'];
const TRUES = ['1', 1, 'true'];

const validateBoolean = (
  value,
  {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    not,
    only,
    nullAsUndefined
  }
) => {
  if (isUndefined(value) || (nullAsUndefined && isNull(value))) {
    if (isNotUndefined(defaultValue)) {
      return clone(defaultValue);
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

const validateSync = (
  value,
  {
    defaultValue,
    allowed,
    required,
    message,
    func,
    parse,
    not,
    only,
    nullAsUndefined
  }
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

const validate = async (
  value,
  {
    defaultValue,
    allowed,
    required,
    message,
    func,
    parse,
    not,
    only,
    nullAsUndefined
  }
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

module.exports = {
  validate,
  validateSync,
  validateBoolean
};
