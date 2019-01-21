const {
  isUndefined,
  isNotUndefined,
  isNumber,
  isString,
  isInteger,
  isNull
} = require('./../../../utils/lodash');
const {
  validateFunctionSync,
  validateFunctionAsync,
  validateOnly,
  validateNot
} = require('./any');

const validateNumber = (
  value,
  {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    min,
    max,
    less,
    greater,
    positive,
    negative,
    integer,
    only,
    not,
    nullAsUndefined
  }
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

  if (parse && isString(value)) {
    if (integer && value.match(/^[+-]?\d+$/)) {
      value = parseInt(value);
    } else if (value.match(/^[-/+]?\d+(\.\d+)?$/)) {
      value = parseFloat(value);
    }
  }

  validateOnly(only, value, message);
  validateNot(not, value, message);

  if (integer) {
    if (!isInteger(value)) {
      if (isNumber(value)) {
        throw message.get('integer_is_number', { value, actual: 'number' });
      } else {
        throw message.get('integer_wrong_type', {
          expected: 'integer',
          actual: typeof value
        });
      }
    }
  } else if (!isNumber(value)) {
    throw message.get('number_wrong_type', {
      expected: 'number',
      actual: typeof value
    });
  }

  if (min && value < min) {
    throw message.get('number_min', {
      expected: min,
      actual: value
    });
  }

  if (max && value > max) {
    throw message.get('number_max', {
      expected: max,
      actual: value
    });
  }

  if (less && value >= less) {
    throw message.get('number_less', {
      expected: less,
      actual: value
    });
  }

  if (greater && value <= greater) {
    throw message.get('number_greater', {
      expected: greater,
      actual: value
    });
  }

  if (positive && value <= 0) {
    throw message.get('number_positive', {
      value
    });
  }

  if (negative && value >= 0) {
    throw message.get('number_negative', {
      value
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
    parse,
    min,
    max,
    less,
    greater,
    positive,
    negative,
    integer,
    only,
    not,
    func,
    nullAsUndefined
  }
) => {
  value = validateNumber(value, {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    min,
    max,
    less,
    greater,
    positive,
    negative,
    integer,
    only,
    not,
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
    parse,
    min,
    max,
    less,
    greater,
    positive,
    negative,
    integer,
    only,
    not,
    func,
    nullAsUndefined
  }
) => {
  value = validateNumber(value, {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    min,
    max,
    less,
    greater,
    positive,
    negative,
    integer,
    only,
    not,
    nullAsUndefined
  });
  return validateFunctionAsync(func, value);
};

module.exports = {
  validate,
  validateSync,
  validateNumber
};
