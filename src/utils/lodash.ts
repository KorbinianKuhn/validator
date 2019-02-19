export const isObjectObject = (value: any): boolean => {
  return (
    value != null && typeof value === 'object' && Array.isArray(value) === false
  );
};

export const isPlainObject = (value: any): boolean => {
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

export const get = (object: any, path: string, defaultValue?: any): any => {
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

export const set = (object: any, path: string, value: any): void => {
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

export const has = (object: any, path: string): boolean => {
  return get(object, path) !== undefined;
};

export const isEqual = (value: any, other: any): boolean => {
  try {
    return JSON.stringify(value) === JSON.stringify(other);
  } catch (err) {
    return false;
  }
};

export const uniqWith = (array: any[], comparator: Function): any[] => {
  const unique = [];

  array.map(v => {
    if (unique.find(o => comparator(o, v)) === undefined) {
      unique.push(v);
    }
  });

  return unique;
};

export const isNull = (value: any): boolean => value === null;

export const isNil = (value: any): boolean => value == null;

export const isNotNil = (value: any): boolean => !isNil(value);

export const isUndefined = (value: any): boolean => value === undefined;

export const isNotUndefined = (value: any): boolean => !isUndefined(value);

export const keys = Object.keys;

export const isString = (value: any): boolean =>
  Object.prototype.toString.call(value) === '[object String]';

export const isBoolean = (value: any): boolean =>
  Object.prototype.toString.call(value) === '[object Boolean]';

export const isInteger = (value: any): boolean => Number.isInteger(value);

export const isNumber = (value: any): boolean =>
  Object.prototype.toString.call(value) === '[object Number]';

export const isSyncFunction = (value: any): boolean =>
  Object.prototype.toString.call(value) === '[object Function]';

export const isAsyncFunction = (value: any): boolean =>
  value.constructor.name === 'AsyncFunction';

export const isFunction = (value: any): boolean =>
  isSyncFunction(value) || isAsyncFunction(value);

export const isRegExp = (value: any): boolean =>
  Object.prototype.toString.call(value) === '[object RegExp]';

export const isArray = (value: any): boolean => Array.isArray(value);

export const isObject = (value: any): boolean => {
  const type = typeof value;
  return value != null && (type == 'object' || type == 'function');
};

export const defaultToAny = (...values: any): any => {
  for (const value of values) {
    if (isNotNil(value)) return value;
  }
  return undefined;
};

export const removeUndefinedProperties = (object: any): any => {
  Object.keys(object).forEach(
    key => isUndefined(object[key]) && delete object[key]
  );
  return object;
};

export const removeNilProperties = (object: any): any => {
  Object.keys(object).forEach(key => isNil(object[key]) && delete object[key]);
  return object;
};

export const clone = (object: any): any => {
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

export const cloneRegex = (regex: RegExp): RegExp => {
  const flags = Object.keys(REGEX_FLAGS)
    .map(flag => (regex[flag] ? REGEX_FLAGS[flag] : ''))
    .join('');

  const clonedRegexp = new RegExp(regex.source, flags);

  clonedRegexp.lastIndex = regex.lastIndex;

  return clonedRegexp;
};
