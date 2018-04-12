const {
  isNil,
  isNotNil,
  isArray,
  isString,
  uniqWith,
  isEqual,
  keys
} = require("./../../../utils/lodash");
const {
  validateFunctionSync,
  validateFunctionAsync,
  validateRequired
} = require("./any");

const validateItemsSync = (value, itemSchema) => {
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

const validateItemsAsync = async (value, itemSchema) => {
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

const validateArray = (
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
    not,
    only
  }
) => {
  if (isNil(value) && isNotNil(defaultValue)) {
    return defaultValue;
  }

  validateRequired(value, required, message);

  if (parse && isString(value)) {
    try {
      value = JSON.parse(value);
    } catch (err) {
      value = value.split(",");
    }
  }

  if (!isArray(value)) {
    throw message.error("wrong_type", {
      expected: "array",
      actual: typeof value
    });
  }

  if (empty === false && value.length === 0) {
    throw message.error("array_empty");
  }

  if (min || max || length) {
    const arrayLength = value.length;
    if (min && arrayLength < min) {
      throw message.error("array_min", { expected: min, actual: arrayLength });
    }

    if (max && arrayLength > max) {
      throw message.error("array_max", { expected: max, actual: arrayLength });
    }

    if (length && arrayLength !== length) {
      throw message.error("array_length", {
        expected: length,
        actual: arrayLength
      });
    }
  }

  if (unique && uniqWith(value, isEqual).length !== value.length) {
    throw message.error("array_duplicate_items");
  }

  // TODO validateNot, validateOnly

  return value;
};

const validateSync = (
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
    not,
    only,
    func,
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
    not,
    only
  });

  value = validateItemsSync(value, itemSchema);
  return validateFunctionSync(func, value);
};

const validate = async (
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
    not,
    only,
    func,
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
    not,
    only
  });

  value = await validateItemsAsync(value, itemSchema);
  return validateFunctionAsync(func, value);
};

module.exports = {
  validate,
  validateSync,
  validateArray,
  validateItemsAsync,
  validateItemsSync
};
