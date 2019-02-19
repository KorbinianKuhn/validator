import { validateFunctionAsync, validateFunctionSync } from './any';
import { keys, isUndefined, isNull, isNotUndefined, isString, isArray, uniqWith, isEqual } from '../../../utils';

export const validateItemsSync = (value, itemSchema) => {
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

export const validateItemsAsync = async (value, itemSchema) => {
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

export const validateArray = (
  value,
  { defaultValue, allowed, required, message, parse, unique, empty, min, max, length, nullAsUndefined, not, only }
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

  // TODO validateNot, validateOnly

  return value;
};

export const validateArraySync = (
  value,
  {
    defaultValue,
    allowed,
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
    itemSchema,
    nullAsUndefined
  }
) => {
  value = validateArray(value, {
    defaultValue,
    allowed,
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
    nullAsUndefined
  });

  value = validateItemsSync(value, itemSchema);
  return validateFunctionSync(func, value);
};

export const validateArrayAsync = async (
  value,
  {
    defaultValue,
    allowed,
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
    itemSchema,
    nullAsUndefined
  }
) => {
  value = validateArray(value, {
    defaultValue,
    allowed,
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
    nullAsUndefined
  });

  value = await validateItemsAsync(value, itemSchema);
  return validateFunctionAsync(func, value);
};
