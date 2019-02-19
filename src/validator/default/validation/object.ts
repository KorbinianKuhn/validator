import {
  isUndefined,
  isNull,
  isNotUndefined,
  isString,
  isPlainObject,
  keys,
  has,
  isNil,
  isEqual,
  get,
  isAsyncFunction,
  getErrorMessage
} from '../../../utils';

export const validateObjectBeforeProperties = (
  value,
  { defaultValue, allowed, required, message, parse, empty, min, max, length, nullAsUndefined }
) => {
  if (isUndefined(value) || (nullAsUndefined && isNull(value))) {
    if (isNotUndefined(defaultValue)) {
      return [false, defaultValue];
    }
    if (required) {
      throw message.get('required', { value });
    } else {
      return [false, undefined];
    }
  }

  if (allowed && allowed.indexOf(value) !== -1) {
    return [false, value];
  }

  if (value === null) {
    throw message.get('not_null', { value });
  }

  if (parse && isString(value)) {
    try {
      value = JSON.parse(value);
    } catch (err) {
      // Do nothing
    }
  }

  if (!isPlainObject(value)) {
    throw message.get('wrong_type', {
      expected: 'object',
      actual: typeof value
    });
  }

  const numKeys = keys(value).length;

  if (numKeys === 0 && empty === false) {
    throw message.get('object_empty');
  }

  if (min && numKeys < min) {
    throw message.get('object_min', { expected: min, actual: numKeys });
  }

  if (max && numKeys > max) {
    throw message.get('object_max', { expected: max, actual: numKeys });
  }

  if (length && numKeys !== length) {
    throw message.get('object_length', { expected: length, actual: numKeys });
  }

  return [true, value];
};

export const validateObjectPropertiesSync = (value, object) => {
  const errors = {};

  for (const key in object) {
    const schema = object[key];
    if (!schema._required && isUndefined(value[key])) {
      continue;
    }
    try {
      const ret = object[key].validateSync(value[key]);
      if (isNotUndefined(ret)) {
        value[key] = ret;
      }
    } catch (err) {
      errors[key] = err;
    }
  }

  if (keys(errors).length > 0) {
    throw errors;
  }

  return value;
};

export const validateObjectPropertiesAsync = async (value, object) => {
  const errors = {};

  for (const key in object) {
    try {
      const ret = await object[key].validate(value[key]);
      if (isNotUndefined(ret)) {
        value[key] = ret;
      }
    } catch (err) {
      errors[key] = err;
    }
  }

  if (keys(errors).length > 0) {
    throw errors;
  }

  return value;
};

export const validateObjectAfterProperties = (value, { unknown, conditions, object, message }) => {
  if (unknown === false) {
    const errors = {};

    for (const key in value) {
      if (!has(object, key)) {
        errors[key] = message.get('object_unknown', { key });
      }
    }

    if (keys(errors).length > 0) {
      throw errors;
    }
  }

  if (conditions) {
    validateObjectConditions(message, value, conditions);
  }
};

export const isGreaterThan = (message, keyA, keyB, a, b) => {
  if (isNil(a) || isNil(b) || isPlainObject(a) || isPlainObject(b)) {
    return;
  }

  if (!(a > b)) {
    throw message.get('condition_gt', { keyA, keyB });
  }
};

export const isGreaterOrEqualThan = (message, keyA, keyB, a, b) => {
  if (isNil(a) || isNil(b) || isPlainObject(a) || isPlainObject(b)) {
    return;
  }

  if (!(a >= b)) {
    throw message.get('condition_gte', { keyA, keyB });
  }
};

export const isLessThan = (message, keyA, keyB, a, b) => {
  if (isNil(a) || isNil(b) || isPlainObject(a) || isPlainObject(b)) {
    return;
  }

  if (!(a < b)) {
    throw message.get('condition_lt', { keyA, keyB });
  }
};

export const isLessOrEqualThan = (message, keyA, keyB, a, b) => {
  if (isNil(a) || isNil(b) || isPlainObject(a) || isPlainObject(b)) {
    return;
  }

  if (!(a <= b)) {
    throw message.get('condition_lte', { keyA, keyB });
  }
};

export const isEqualCondition = (message, keyA, keyB, a, b) => {
  if (!isEqual(a, b)) {
    throw message.get('condition_equals', { keyA, keyB });
  }
};

export const isNotEqual = (message, keyA, keyB, a, b) => {
  if (isEqual(a, b)) {
    throw message.get('condition_not_equals', { keyA, keyB });
  }
};

export const xor = (message, keyA, keyB, a, b) => {
  if ((a !== undefined && b !== undefined) || (a === undefined && b === undefined)) {
    throw message.get('condition_xor', { keyA, keyB });
  }
};

export const or = (message, keyA, keyB, a, b) => {
  if (a !== undefined && b !== undefined) {
    throw message.get('condition_or', { keyA, keyB });
  }
};

export const dependsOn = (message, keyA, keyB, a, b) => {
  if (a !== undefined && b === undefined) {
    throw message.get('condition_depends_on', { keyA, keyB });
  }
};

export const validateCondition = (message, method, keyA, keyB, a, b) => {
  switch (method) {
    case 'gt':
      return isGreaterThan(message, keyA, keyB, a, b);
    case 'gte':
      return isGreaterOrEqualThan(message, keyA, keyB, a, b);
    case 'lt':
      return isLessThan(message, keyA, keyB, a, b);
    case 'lte':
      return isLessOrEqualThan(message, keyA, keyB, a, b);
    case 'equals':
      return isEqualCondition(message, keyA, keyB, a, b);
    case 'notEquals':
      return isNotEqual(message, keyA, keyB, a, b);
    case 'xor':
      return xor(message, keyA, keyB, a, b);
    case 'or':
      return or(message, keyA, keyB, a, b);
    case 'dependsOn':
      return dependsOn(message, keyA, keyB, a, b);
  }
};

export const validateObjectConditions = (message, value, conditions) => {
  const errors = {};

  for (const condition of conditions) {
    const keyA = condition.keyA;
    const keyB = condition.keyB;
    const a = get(value, keyA);
    const b = get(value, keyB);
    try {
      validateCondition(message, condition.method, keyA, keyB, a, b);
    } catch (err) {
      if (keyA in errors) {
        errors[keyA] = `${errors[keyA]} ${err}`;
      } else {
        errors[keyA] = err;
      }
    }
  }

  if (keys(errors).length > 0) {
    throw errors;
  }
};

export const validateObjectFunctionSync = (value, func) => {
  if (func) {
    const errors = {};

    const fn = func.fn;
    const values = [];
    for (const key of func.keys) {
      values.push(get(value, key, null));
    }
    try {
      fn(...values);
    } catch (err) {
      errors[`[${func.keys.join(', ')}]`] = getErrorMessage(err);
    }

    if (keys(errors).length > 0) {
      throw errors;
    }
  }

  return value;
};

export const validateObjectFunctionAsync = async (value, func) => {
  if (func) {
    const errors = {};

    const fn = func.fn;
    const values = [];
    for (const key of func.keys) {
      values.push(get(value, key, null));
    }
    try {
      if (isAsyncFunction(fn)) {
        await fn(...values);
      } else {
        fn(...values);
      }
    } catch (err) {
      errors[`[${func.keys.join(', ')}]`] = getErrorMessage(err);
    }

    if (keys(errors).length > 0) {
      throw errors;
    }
  }

  return value;
};

export const validateObjectSync = (
  value,
  {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    empty,
    min,
    max,
    length,
    object,
    func,
    unknown,
    conditions,
    nullAsUndefined
  }
) => {
  let [continueValidation, checkedValue] = validateObjectBeforeProperties(value, {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    empty,
    min,
    max,
    length,
    nullAsUndefined
  });

  if (continueValidation) {
    checkedValue = validateObjectPropertiesSync(checkedValue, object);

    validateObjectAfterProperties(checkedValue, {
      unknown,
      conditions,
      message,
      object
    });

    validateObjectFunctionSync(checkedValue, func);
  }

  return checkedValue;
};

export const validateObjectAsync = async (
  value,
  {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    empty,
    min,
    max,
    length,
    object,
    func,
    unknown,
    conditions,
    nullAsUndefined
  }
) => {
  let [continueValidation, checkedValue] = validateObjectBeforeProperties(value, {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    empty,
    min,
    max,
    length,
    nullAsUndefined
  });

  if (continueValidation) {
    checkedValue = await validateObjectPropertiesAsync(checkedValue, object);

    validateObjectAfterProperties(checkedValue, {
      unknown,
      conditions,
      message,
      object
    });

    await validateObjectFunctionAsync(checkedValue, func);
  }

  return checkedValue;
};
