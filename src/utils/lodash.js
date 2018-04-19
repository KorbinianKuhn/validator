const defaultTo = require("lodash/defaultTo");
const isString = require("lodash/isString");
const isBoolean = require("lodash/isBoolean");
const isInteger = require("lodash/isInteger");
const isPlainObject = require("lodash/isPlainObject");
const isArray = require("lodash/isArray");
const isFunction = require("lodash/isFunction");
const isNil = require("lodash/isNil");
const get = require("lodash/get");
const set = require("lodash/set");
const has = require("lodash/has");
const defaults = require("lodash/defaults");
const hasIn = require("lodash/hasIn");
const isNumber = require("lodash/isNumber");
const cloneDeep = require("lodash/cloneDeep");
const pickBy = require("lodash/pickBy");
const uniqWith = require("lodash/uniqWith");
const isEqual = require("lodash/isEqual");
const isRegExp = require("lodash/isRegExp");
const isUndefined = require("lodash/isUndefined");
const isNull = require("lodash/isNull");

const AsyncFunction = (async () => {}).constructor;
const isAsyncFunction = func => func instanceof AsyncFunction;

const isNotNil = value => !isNil(value);

const isNotUndefined = value => !isUndefined(value);

const keys = Object.keys;

const defaultToAny = (...values) => {
  for (const value of values) {
    if (isNotNil(value)) return value;
  }
  return undefined;
};

module.exports = {
  defaultTo,
  defaultToAny,
  isString,
  isBoolean,
  isInteger,
  isPlainObject,
  isArray,
  isFunction,
  isNil,
  get,
  set,
  has,
  keys,
  defaults,
  hasIn,
  isNumber,
  cloneDeep,
  pickBy,
  isAsyncFunction,
  isNotNil,
  uniqWith,
  isEqual,
  isRegExp,
  isUndefined,
  isNotUndefined,
  isNull
};
