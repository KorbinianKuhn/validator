const isInteger = require('lodash/isInteger');
const isPlainObject = require('lodash/isPlainObject');
const get = require('lodash/get');
const set = require('lodash/set');
const has = require('lodash/has');
const hasIn = require('lodash/hasIn');
const cloneDeep = require('lodash/cloneDeep');
const uniqWith = require('lodash/uniqWith');
const isEqual = require('lodash/isEqual');

const isObject = require('lodash/isObject');

const isAsyncFunction = func => func.constructor.name === 'AsyncFunction';

const isNotNil = value => value != null;

const isUndefined = value => value === undefined;

const isNotUndefined = value => !isUndefined(value);

const keys = Object.keys;

const isString = value =>
  Object.prototype.toString.call(value) === '[object String]';

const isBoolean = value =>
  Object.prototype.toString.call(value) === '[object Boolean]';

const isNumber = value =>
  Object.prototype.toString.call(value) === '[object Number]';

const isFunction = value =>
  Object.prototype.toString.call(value) === '[object Function]';

const isRegExp = value =>
  Object.prototype.toString.call(value) === '[object RegExp]';

const isArray = value => Array.isArray(value);

const defaultToAny = (...values) => {
  for (const value of values) {
    if (isNotNil(value)) return value;
  }
  return undefined;
};

const removeUndefinedProperties = object => {
  Object.keys(object).forEach(
    key => object[key] === undefined && delete object[key]
  );
  return object;
};

const removeNilProperties = object => {
  Object.keys(object).forEach(key => object[key] == null && delete object[key]);
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
