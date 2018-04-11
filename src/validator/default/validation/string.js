const { isNil, isString } = require('./../../../utils/lodash');

const validateSync = (exports.validateSync = (
  value,
  { defaultValue, required, message, trim, empty, min, max, length, pattern }
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

  if (!isString(value)) {
    throw message.error('wrong_type', { expected: 'string', actual: value });
  }

  if (trim) {
    value = value.trim();
  }

  if (value === '' && empty === false) {
    throw message.error('string_empty');
  }

  if (min || max || length) {
    const stringLength = value.length;
    if (min && stringLength < min) {
      throw message.error('string_min', {
        expected: min,
        actual: stringLength
      });
    }

    if (max && stringLength > max) {
      throw message.error('string_max', {
        expected: max,
        actual: stringLength
      });
    }

    if (length && stringLength !== length) {
      throw message.error('string_length', {
        expected: length,
        actual: stringLength
      });
    }
  }

  if (pattern && !value.match(pattern)) {
    // TODO throw custom message
    // throw schema._message[schema._language];
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
    trim,
    empty,
    min,
    max,
    length,
    pattern
  }
) =>
  validateSync(value, {
    defaultValue,
    required,
    message,
    parse,
    trim,
    empty,
    min,
    max,
    length,
    pattern
  });
