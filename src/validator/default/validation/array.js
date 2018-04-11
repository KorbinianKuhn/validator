const {
  isNil,
  isArray,
  isString,
  uniqWith,
  isEqual,
  keys
} = require('./../../../utils/lodash');

const validateItemsSync = (value, { itemSchema }) => {
  if (itemSchema !== undefined) {
    const errors = {};

    for (const index in value) {
      try {
        value[index] = itemSchema.validateSync(value[index]);
      } catch (err) {
        errors[index] = err;
      }
    }

    if (keys(errors).length > 0) {
      throw errors;
    } else {
      return value;
    }
  } else {
    return value;
  }
};

const validateItemsAsync = async (value, { itemSchema }) => {
  if (itemSchema !== undefined) {
    const errors = {};

    for (const index in value) {
      try {
        value[index] = await itemSchema.validate(value[index]);
      } catch (err) {
        errors[index] = err;
      }
    }

    if (keys(errors).length > 0) {
      throw errors;
    } else {
      return value;
    }
  } else {
    return value;
  }
};

const validateArray = (exports.validateSync = (
  value,
  {
    defaultValue,
    required,
    message,
    parse,
    unique,
    empty,
    min,
    max,
    length,
    itemSchema
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
    try {
      value = JSON.parse(value);
    } catch (err) {
      value = value.split(',');
    }
  }

  if (!isArray(value)) {
    throw message.get('wrong_type', {
      expected: 'array',
      actual: typeof value
    });
  }

  if (empty === false && value.length === 0) {
    throw message.get('array_empty');
  }

  if (min || max || length) {
    const arrayLength = value.length;
    if (min && arrayLength < min) {
      throw message.get('array_min', { expected: min, actual: arrayLength });
    }

    if (max && arrayLength > max) {
      throw message.get('array_max', { expected: max, actual: arrayLength });
    }

    if (length && arrayLength !== length) {
      throw message.get('array_length', {
        expected: length,
        actual: arrayLength
      });
    }
  }

  if (unique && uniqWith(value, isEqual).length !== value.length) {
    throw message.get('array_duplicate_items');
  }

  return value;
});

exports.validateSync = async (
  value,
  {
    defaultValue,
    required,
    message,
    parse,
    unique,
    empty,
    min,
    max,
    length,
    itemSchema
  }
) => {
  value = validateArray(value, {
    defaultValue,
    required,
    message,
    parse,
    unique,
    empty,
    min,
    max,
    length,
    itemSchema
  });
  return validateItemsSync(value, { itemSchema });
};

exports.validate = async (
  value,
  {
    defaultValue,
    required,
    message,
    parse,
    unique,
    empty,
    min,
    max,
    length,
    itemSchema
  }
) => {
  value = validateArray(value, {
    defaultValue,
    required,
    message,
    parse,
    unique,
    empty,
    min,
    max,
    length,
    itemSchema
  });
  return validateItemsAsync(value, { itemSchema });
};
