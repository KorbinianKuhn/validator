const {
  isNil,
  isString,
  isPlainObject,
  keys,
  has,
  get,
  isEqual,
  at
} = require("./../../../utils/lodash");

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
      throw message.get("required", { value });
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
    throw message.get("wrong_type", { expected: "object", actual: value });
  }

  const numKeys = keys(value).length;

  if (length === 0 && empty === false) {
    throw message.get("empty_object");
  }

  if (min && numKeys < min) {
    throw message.get("object_min", { expected: min, actual: numKeys });
  }

  if (max && numKeys > max) {
    throw message.get("object_max", { expected: max, actual: numKeys });
  }

  if (length && numKeys !== length) {
    throw message.get("object_length", { expected: length, actual: numKeys });
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
        errors[key] = message.get("object_unknown_key", { key });
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
      errors[`[${keys.join(", ")}]`] = err instanceof Error ? err.message : err;
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
      errors[`[${keys.join(", ")}]`] = err instanceof Error ? err.message : err;
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
const compare = (value, keyA, conditions, language, messages) => {
  const errors = [];
  for (const method in conditions) {
    const keyB = conditions[method];
    const a = at(value, keyA)[0];
    const b = at(value, conditions[method])[0];

    if (method !== 'dependsOn' && (!a || !b)) {
      continue;
    }

    if (['gt', 'lt', 'gte', 'lte'].indexOf(method) !== -1) {
      if (isPlainObject(a) || isPlainObject(b)) {
        continue;
      } else {
        switch (method) {
          case 'gt':
            if (!(a > b)) errors.push(message.get(language, messages, 'object', 'gt', keyB, keyA));
            break;
          case 'gte':
            if (!(a >= b)) errors.push(message.get(language, messages, 'object', 'gte', keyB, keyA));
            break;
          case 'lt':
            if (!(a < b)) errors.push(message.get(language, messages, 'object', 'lt', keyB, keyA));
            break;
          case 'lte':
            if (!(a <= b)) errors.push(message.get(language, messages, 'object', 'lte', keyB, keyA));
            break;
        }
        continue;
      }
    }

    switch (method) {
      case 'equals':
        if (!isEqual(a, b)) errors.push(message.get(language, messages, 'object', 'equals', keyB, keyA));
        break;
      case 'notEquals':
        if (isEqual(a, b)) errors.push(message.get(language, messages, 'object', 'not_equals', keyB, keyA));
        break;
      case 'xor':
        errors.push(message.get(language, messages, 'object', 'xor', keyB, keyA));
        break;
      case 'dependsOn':
        if (a && !b) errors.push(message.get(language, messages, 'object', 'depends_on', keyB, keyA));
        break;
    }
  }

  if (errors.length > 0) {
    throw errors.join(', ');
  }
};
*/
