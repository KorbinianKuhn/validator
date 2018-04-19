const {
  isUndefined,
  isNotUndefined,
  isString,
  isPlainObject,
  keys,
  has,
  get,
  isEqual,
  isAsyncFunction
} = require("./../../../utils/lodash");
const { validateRequired } = require("./any");
const { getErrorMessage } = require("./../../../../src/utils/error");

const validateObjectBeforeProperties = (
  value,
  { defaultValue, allowed, required, message, parse, empty, min, max, length }
) => {
  if (isUndefined(value) && isNotUndefined(defaultValue)) {
    return defaultValue;
  }

  if (allowed && allowed.indexOf(value) !== -1) {
    return value;
  }

  validateRequired(value, required, message);

  if (parse && isString(value)) {
    try {
      value = JSON.parse(value);
    } catch (err) {
      // Do nothing
    }
  }

  if (!isPlainObject(value)) {
    throw message.get("wrong_type", {
      expected: "object",
      actual: typeof value
    });
  }

  const numKeys = keys(value).length;

  if (numKeys === 0 && empty === false) {
    throw message.get("object_empty");
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
};

const validateObjectPropertiesSync = (value, object) => {
  const errors = {};

  for (const key in object) {
    try {
      value[key] = object[key].validateSync(value[key]);
    } catch (err) {
      errors[key] = err;
    }
  }

  if (keys(errors).length > 0) {
    throw errors;
  }

  return value;
};

const validateObjectPropertiesAsync = async (value, object) => {
  const errors = {};

  for (const key in object) {
    try {
      value[key] = await object[key].validate(value[key]);
    } catch (err) {
      errors[key] = err;
    }
  }

  if (keys(errors).length > 0) {
    throw errors;
  }

  return value;
};

const validateObjectAfterProperties = (
  value,
  { unknown, conditions, object, message }
) => {
  if (unknown === false) {
    const errors = {};

    for (const key in value) {
      if (!has(object, key)) {
        errors[key] = message.get("object_unknown", { key });
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

const isGreaterThan = (message, keyA, keyB, a, b) => {
  if (isPlainObject(a) || isPlainObject(b)) {
    return;
  }

  if (!(a > b)) {
    throw message.get("condition_gt", { keyA, keyB });
  }
};

const isGreaterOrEqualThan = (message, keyA, keyB, a, b) => {
  if (isPlainObject(a) || isPlainObject(b)) {
    return;
  }

  if (!(a >= b)) {
    throw message.get("condition_gte", { keyA, keyB });
  }
};

const isLessThan = (message, keyA, keyB, a, b) => {
  if (isPlainObject(a) || isPlainObject(b)) {
    return;
  }

  if (!(a < b)) {
    throw message.get("condition_lt", { keyA, keyB });
  }
};

const isLessOrEqualThan = (message, keyA, keyB, a, b) => {
  if (isPlainObject(a) || isPlainObject(b)) {
    return;
  }

  if (!(a <= b)) {
    throw message.get("condition_lte", { keyA, keyB });
  }
};

const isEqualCondition = (message, keyA, keyB, a, b) => {
  if (!isEqual(a, b)) {
    throw message.get("condition_equals", { keyA, keyB });
  }
};

const isNotEqual = (message, keyA, keyB, a, b) => {
  if (isEqual(a, b)) {
    throw message.get("condition_not_equals", { keyA, keyB });
  }
};

const xor = (message, keyA, keyB, a, b) => {
  if (
    (a !== undefined && b !== undefined) ||
    (a === undefined && b === undefined)
  ) {
    throw message.get("condition_xor", { keyA, keyB });
  }
};

const or = (message, keyA, keyB, a, b) => {
  if (a !== undefined && b !== undefined) {
    throw message.get("condition_or", { keyA, keyB });
  }
};

const dependsOn = (message, keyA, keyB, a, b) => {
  if (a !== undefined && b === undefined) {
    throw message.get("condition_depends_on", { keyA, keyB });
  }
};

const validateCondition = (message, method, keyA, keyB, a, b) => {
  switch (method) {
    case "gt":
      return isGreaterThan(message, keyA, keyB, a, b);
    case "gte":
      return isGreaterOrEqualThan(message, keyA, keyB, a, b);
    case "lt":
      return isLessThan(message, keyA, keyB, a, b);
    case "lte":
      return isLessOrEqualThan(message, keyA, keyB, a, b);
    case "equals":
      return isEqualCondition(message, keyA, keyB, a, b);
    case "notEquals":
      return isNotEqual(message, keyA, keyB, a, b);
    case "xor":
      return xor(message, keyA, keyB, a, b);
    case "or":
      return or(message, keyA, keyB, a, b);
    case "dependsOn":
      return dependsOn(message, keyA, keyB, a, b);
  }
};

const validateObjectConditions = (message, value, conditions) => {
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

const validateObjectFunctionSync = (value, func) => {
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
      errors[`[${func.keys.join(", ")}]`] = getErrorMessage(err);
    }

    if (keys(errors).length > 0) {
      throw errors;
    }
  }

  return value;
};

const validateObjectFunctionAsync = async (value, func) => {
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
      errors[`[${func.keys.join(", ")}]`] = getErrorMessage(err);
    }

    if (keys(errors).length > 0) {
      throw errors;
    }
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
    empty,
    min,
    max,
    length,
    object,
    func,
    unknown,
    conditions
  }
) => {
  value = validateObjectBeforeProperties(value, {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    empty,
    min,
    max,
    length
  });

  value = validateObjectPropertiesSync(value, object);

  validateObjectAfterProperties(value, {
    unknown,
    conditions,
    message,
    object
  });

  validateObjectFunctionSync(value, func);

  return value;
};

const validate = async (
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
    conditions
  }
) => {
  value = validateObjectBeforeProperties(value, {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    empty,
    min,
    max,
    length
  });

  value = await validateObjectPropertiesAsync(value, object);

  validateObjectAfterProperties(value, {
    unknown,
    conditions,
    message,
    object
  });

  validateObjectFunctionAsync(value, func);

  return value;
};

module.exports = {
  validate,
  validateSync,
  validateObjectBeforeProperties,
  validateObjectPropertiesSync,
  validateObjectPropertiesAsync,
  validateObjectAfterProperties,
  validateCondition,
  validateObjectConditions,
  validateObjectFunctionSync,
  validateObjectFunctionAsync
};
