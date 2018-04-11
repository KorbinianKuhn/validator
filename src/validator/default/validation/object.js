const {
  isNil,
  isString,
  isPlainObject,
  keys,
  has,
  get,
  isEqual,
  at
} = require('./../../../utils/lodash');

const AsyncFunction = (async () => {}).constructor;
const isAsyncFunction = func =>
  (func instanceof AsyncFunction && AsyncFunction !== Function) === true;

const validateObjectBeforeProperties = (exports.validateObjectBeforeProperties = (
  value,
  { defaultValue, required, message, parse, empty, min, max, length }
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
      // Do nothing
    }
  }

  if (!isPlainObject(value)) {
    throw message.get('wrong_type', { expected: 'object', actual: value });
  }

  const numKeys = keys(value).length;

  if (length === 0 && empty === false) {
    throw message.get('empty_object');
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

  return value;
});

const validateObjectPropertiesSync = (exports.validateObjectPropertiesSync = (
  errors,
  value,
  object
) => {
  for (const key in object) {
    try {
      const result = object[key].validate(value[key]);
      if (!isNil(result)) {
        value[key] = result;
      }
    } catch (err) {
      errors[key] = err;
    }
  }
});

const validateObjectPropertiesAsync = (exports.validateObjectPropertiesAsync = async (
  errors,
  value,
  object
) => {
  for (const key in object) {
    try {
      const result = await object[key].validate(value[key]);
      if (!isNil(result)) {
        value[key] = result;
      }
    } catch (err) {
      errors[key] = err;
    }
  }
});

const validateObjectAfterProperties = (exports.validateObjectBeforeProperties = (
  errors,
  value,
  { noUndefinedKeys, conditions, object, message }
) => {
  if (noUndefinedKeys) {
    for (const key in value) {
      if (!has(object, key)) {
        errors[key] = message.get('object_unknown_key', { key });
      }
    }
  }

  // TODO check conditions
  /*
  if (conditions && keys(errors).length === 0) {
    for (const key in conditions) {
      try {
        // TODO check condition
        // compare(value, key, conditions[key], language, messages);
      } catch (err) {
        errors[key] = err;
      }
    }
  } */
});

const validateObjectFunctionSync = (exports.validateObjectFunctionSync = async (
  errors,
  value,
  func
) => {
  if (func) {
    const fn = func.fn;
    const values = [];
    for (const key of func.keys) {
      values.push(get(value, key, null));
    }
    try {
      fn(...values);
    } catch (err) {
      errors[`[${keys.join(', ')}]`] = err instanceof Error ? err.message : err;
    }
  }
});

const validateObjectFunctionAsync = (exports.validateObjectFunctionAsync = async (
  errors,
  value,
  func
) => {
  if (func) {
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
      errors[`[${keys.join(', ')}]`] = err instanceof Error ? err.message : err;
    }
  }
});

exports.validateSync = (
  value,
  {
    defaultValue,
    required,
    message,
    parse,
    empty,
    min,
    max,
    length,
    object,
    func
  }
) => {
  value = validateObjectBeforeProperties(value, {
    defaultValue,
    required,
    message,
    parse,
    empty,
    min,
    max,
    length
  });
  const errors = {};
  validateObjectPropertiesSync(errors, value, object);

  validateObjectAfterProperties(errors, value, object);

  validateObjectFunctionSync(errors, value, func);

  if (keys(errors).length > 0) {
    throw errors;
  } else {
    return value;
  }
};

exports.validate = async (
  value,
  {
    defaultValue,
    required,
    message,
    parse,
    empty,
    min,
    max,
    length,
    object,
    func
  }
) => {
  value = validateObjectBeforeProperties(value, {
    defaultValue,
    required,
    message,
    parse,
    empty,
    min,
    max,
    length
  });
  const errors = {};
  await validateObjectPropertiesAsync(errors, value, object);

  validateObjectAfterProperties(errors, value, object);

  await validateObjectFunctionAsync(errors, value, func);

  if (keys(errors).length > 0) {
    throw errors;
  } else {
    return value;
  }
};
/*
const isGreaterThan = (keyA, keyB, a, b) => {
  if (isPlainObject(a) || isPlainObject(b)) {
    return;
  }

  if (!(a > b)) {
    throw message.get('condition_gt', { keyA, keyB });
  }
};

const isGreaterOrEqualThan = (keyA, keyB, a, b) => {
  if (isPlainObject(a) || isPlainObject(b)) {
    return;
  }

  if (!(a >= b)) {
    throw message.get('condition_gte', { keyA, keyB });
  }
};

const isLessThan = (keyA, keyB, a, b) => {
  if (isPlainObject(a) || isPlainObject(b)) {
    return;
  }

  if (!(a < b)) {
    throw message.get('condition_lt', { keyA, keyB });
  }
};

const isLessOrEqualThan = (keyA, keyB, a, b) => {
  if (isPlainObject(a) || isPlainObject(b)) {
    return;
  }

  if (!(a <= b)) {
    throw message.get('condition_lte', { keyA, keyB });
  }
};

const isEqual = (keyA, keyB, a, b) => {
  if (!_.isEqual(a, b)) {
    throw message.get('condition_equals', { keyA, keyB });
  }
};

const isNotEqual = (keyA, keyB, a, b) => {
  if (_.isEqual(a, b)) {
    throw message.get('condition_not_equals', { keyA, keyB });
  }
};

const xor = (keyA, keyB, a, b) => {
  if (
    (a !== undefined && b !== undefined) ||
    (a === undefined && b === undefined)
  ) {
    throw message.get('condition_xor', { keyA, keyB });
  }
};

const dependsOn = (keyA, keyB, a, b) => {
  if (a !== undefined && b === undefined) {
    throw message.get('condition_depends_on', { keyA, keyB });
  }
};

const validateCondition = (method, keyA, keyB, a, b) => {
  switch (method) {
    case 'gt':
      return isGreaterThan(keyA, keyB, a, b);
    case 'get':
      return isGreaterOrEqualThan(keyA, keyB, a, b);
    case 'lt':
      return isLessThan(keyA, keyB, a, b);
    case 'lte':
      return isLessOrEqualThan(keyA, keyB, a, b);
    case 'equals':
      return isEqual(keyA, keyB, a, b);
    case 'notEquals':
      return isNotEqual(keyA, keyB, a, b);
    case 'xor':
      return xor(keyA, keyB, a, b);
    case 'dependsOn':
      return dependsOn(keyA, keyB, a, b);
  }
};

const validateObjectConditions = (value, conditions) => {
  const errors = {};
  for (const condition of conditions) {
    const keyA = condition.keyA;
    const keyB = condition.keyB;
    const a = _.get(value, keyA);
    const b = _.get(value, keyB);
    try {
      validateCondition(condition.method, keyA, keyB, a, b);
    } catch (err) {
      if (keyA in errors) {
        errors[keyA] = `${errors[keyA]}, ${err}`;
      } else {
        errors[keyA] = err;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    throw errors;
  }
};
*/
