const isPlainObject = require('lodash/isPlainObject');
const get = require('lodash/get');
const set = require('lodash/set');
const cloneDeep = require('lodash/cloneDeep');
const uniqWith = require('lodash/uniqWith');
const isEqual = require('lodash/isEqual');
const has = require('lodash/has');
const hasIn = require('lodash/hasIn');

const isAsyncFunction = func => func.constructor.name === 'AsyncFunction';

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

const isFunction = value =>
  Object.prototype.toString.call(value) === '[object Function]';

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

module.exports = {
  defaultToAny,
  isString,
  isBoolean,
  isInteger,
  isPlainObject,
  isArray,
  isFunction,
  get,
  set,
  has,
  keys,
  hasIn,
  isNumber,
  cloneDeep,
  isAsyncFunction,
  isNotNil,
  uniqWith,
  isEqual,
  isRegExp,
  isUndefined,
  isNotUndefined,
  removeUndefinedProperties,
  isObject,
  removeNilProperties
};
