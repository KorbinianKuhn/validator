const isObjectObject = value => {
  return (
    value != null && typeof value === 'object' && Array.isArray(value) === false
  );
};

const isPlainObject = value => {
  let ctor, prot;

  if (isObjectObject(value) === false) {
    return false;
  }

  ctor = value.constructor;
  if (typeof ctor !== 'function') {
    return false;
  }

  prot = ctor.prototype;
  if (isObjectObject(prot) === false) {
    return false;
  }

  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  return true;
};

const get = (object, path, defaultValue) => {
  let temp = object;
  try {
    path.split('.').map(key => {
      temp = temp[key];
    });
  } catch (err) {
    return defaultValue;
  }
  return temp === undefined ? defaultValue : temp;
};

const set = (object, path, value) => {
  let temp = object;
  const keys = path.split('.');
  const length = keys.length - 1;
  for (let i = 0; i < length; i++) {
    const key = keys[i];
    if (temp[key] === undefined) {
      temp[key] = {};
    }
    temp = temp[key];
  }
  temp[keys[length]] = value;
};

const has = (object, path) => {
  return get(object, path) !== undefined;
};

const isEqual = (value, other) => {
  try {
    return JSON.stringify(value) === JSON.stringify(other);
  } catch (err) {
    return false;
  }
};

const uniqWith = (array, comparator) => {
  const unique = [];

  array.map(v => {
    if (unique.find(o => comparator(o, v)) === undefined) {
      unique.push(v);
    }
  });

  return unique;
};

const isNil = value => value == null;

const isNotNil = value => !isNil(value);

const isUndefined = value => value === undefined;

const isNotUndefined = value => !isUndefined(value);

const keys = Object.keys;

const isString = value =>
  Object.prototype.toString.call(value) === '[object String]';

const isBoolean = value =>
  Object.prototype.toString.call(value) === '[object Boolean]';

const isInteger = value => Number.isInteger(value);

const isNumber = value =>
  Object.prototype.toString.call(value) === '[object Number]';

const isSyncFunction = value =>
  Object.prototype.toString.call(value) === '[object Function]';

const isAsyncFunction = func => func.constructor.name === 'AsyncFunction';

const isFunction = func => isSyncFunction(func) || isAsyncFunction(func);

const isRegExp = value =>
  Object.prototype.toString.call(value) === '[object RegExp]';

const isArray = value => Array.isArray(value);

const isObject = value => {
  const type = typeof value;
  return value != null && (type == 'object' || type == 'function');
};

const defaultToAny = (...values) => {
  for (const value of values) {
    if (isNotNil(value)) return value;
  }
  return undefined;
};

const removeUndefinedProperties = object => {
  Object.keys(object).forEach(
    key => isUndefined(object[key]) && delete object[key]
  );
  return object;
};

const removeNilProperties = object => {
  Object.keys(object).forEach(key => isNil(object[key]) && delete object[key]);
  return object;
};

const clone = object => {
  return JSON.parse(JSON.stringify(object));
};

const REGEX_FLAGS = {
  global: 'g',
  ignoreCase: 'i',
  multiline: 'm',
  dotAll: 's',
  sticky: 'y',
  unicode: 'u'
};

const cloneRegex = regex => {
  const flags = Object.keys(REGEX_FLAGS)
    .map(flag => (regex[flag] ? REGEX_FLAGS[flag] : ''))
    .join('');

  const clonedRegexp = new RegExp(regex.source, flags);

  clonedRegexp.lastIndex = regex.lastIndex;

  return clonedRegexp;
};

module.exports = {
  defaultToAny,
  isString,
  isBoolean,
  isInteger,
  isPlainObject,
  isArray,
  isFunction,
  isSyncFunction,
  isAsyncFunction,
  get,
  set,
  has,
  keys,
  isNumber,
  isNotNil,
  uniqWith,
  isEqual,
  isRegExp,
  isUndefined,
  isNotUndefined,
  removeUndefinedProperties,
  isObject,
  removeNilProperties,
  clone,
  cloneRegex
};
