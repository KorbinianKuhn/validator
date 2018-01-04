const TYPE_ARRAY = require('./array');
const TYPE_BOOLEAN = require('./boolean');
const TYPE_ENUM = require('./enum');
const TYPE_FUNCTION = require('./function');
const TYPE_INTEGER = require('./integer');
const TYPE_NUMBER = require('./number');
const TYPE_OBJECT = require('./object');
const TYPE_REGEX = require('./regex');
const TYPE_STRING = require('./string');

const TYPES = {
  Array: TYPE_ARRAY,
  Boolean: TYPE_BOOLEAN,
  Enum: TYPE_ENUM,
  Function: TYPE_FUNCTION,
  Integer: TYPE_INTEGER,
  Number: TYPE_NUMBER,
  Object: TYPE_OBJECT,
  Regex: TYPE_REGEX,
  String: TYPE_STRING,
}

module.exports = TYPES;