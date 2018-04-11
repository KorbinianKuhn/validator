const defaultTo = require('lodash/defaultTo');
const isString = require('lodash/isString');
const isBoolean = require('lodash/isBoolean');
const isInteger = require('lodash/isInteger');
const isPlainObject = require('lodash/isPlainObject');
const isArray = require('lodash/isArray');
const isFunction = require('lodash/isFunction');
const isNil = require('lodash/isNil');
const get = require('lodash/get');
const set = require('lodash/set');
const at = require('lodash/at');
const has = require('lodash/has');
const keys = require('lodash/keys');
const defaults = require('lodash/defaults');
const hasIn = require('lodash/hasIn');
const isNumber = require('lodash/isNumber');
const cloneDeep = require('lodash/cloneDeep');
const pickBy = require('lodash/pickBy');

const AsyncFunction = (async () => {}).constructor;
const isAsyncFunction = func => func instanceof AsyncFunction;

const isNotNil = value => !isNil(value);

module.exports = {
  defaultTo,
  isString,
  isBoolean,
  isInteger,
  isPlainObject,
  isArray,
  isFunction,
  isNil,
  get,
  set,
  at,
  has,
  keys,
  defaults,
  hasIn,
  isNumber,
  cloneDeep,
  pickBy,
  isAsyncFunction,
  isNotNil
};
