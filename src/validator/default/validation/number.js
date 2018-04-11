const {
  isNil,
  isNumber,
  isString,
  isInteger
} = require('./../../../utils/lodash');

const validateSync = (exports.validateSync = (
  value,
  {
    defaultValue,
    required,
    message,
    parse,
    min,
    max,
    less,
    greater,
    positive,
    negative,
    integer
  }
) => {
  if (isNil(value)) {
    if (defaultValue) {
      return defaultValue;
    } else if (required) {
      throw message.error('required', { value });
    } else {
      return value;
    }
  }

  if (parse && isString(value)) {
    if (integer) {
      if (value.match(/^[+-]?\d+$/)) {
        value = parseInt(value);
      }
    } else if (value.match(/^[-/+]?\d+(\.\d+)?$/)) {
      value = parseFloat(value);
    }
  }

  if (integer) {
    if (!isInteger(value)) {
      if (isNumber(value)) {
        throw message.error('integer_is_number', { value });
      } else {
        throw message.error('wrong_type', { actual: value });
      }
    }
  } else if (!isNumber(value)) {
    throw message.error('wrong_type', {
      expected: integer ? 'integer' : 'number',
      actual: value
    });
  }

  if (min && value < min) {
    throw message.error(integer ? 'integer_min' : 'number_min', {
      expected: min,
      actual: value
    });
  }

  if (max && value > max) {
    throw message.error(integer ? 'integer_max' : 'number_max', {
      expected: max,
      actual: value
    });
  }

  if (less && value >= less) {
    throw message.error(integer ? 'integer_less' : 'number_less', {
      expected: less,
      actual: value
    });
  }

  if (greater && value <= greater) {
    throw message.error(integer ? 'integer_greater' : 'number_greater', {
      expected: greater,
      actual: value
    });
  }

  if (positive && value <= 0) {
    throw message.error(integer ? 'integer_positive' : 'number_positive', {
      value
    });
  }

  if (negative && value >= 0) {
    throw message.error(integer ? 'integer_negative' : 'number_negative', {
      value
    });
  }

  return value;
});

exports.validate = async (
  value,
  {
    defaultValue,
    required,
    message,
    parse,
    min,
    max,
    less,
    greater,
    positive,
    negative,
    integer
  }
) =>
  validateSync(value, {
    defaultValue,
    required,
    message,
    parse,
    min,
    max,
    less,
    greater,
    positive,
    negative,
    integer
  });
