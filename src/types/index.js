const ARRAY = require('./array');
const BOOLEAN = require('./boolean');
const DATE = require('./date');
const ENUM = require('./enum');
const FUNCTION = require('./function');
const INTEGER = require('./integer');
const NUMBER = require('./number');
const OBJECT = require('./object');
const REGEX = require('./regex');
const REQUEST = require('./request');
const STRING = require('./string');

const TYPES = {
  Array: ARRAY,
  Boolean: BOOLEAN,
  Date: DATE,
  Enum: ENUM,
  Function: FUNCTION,
  Integer: INTEGER,
  Number: NUMBER,
  Object: OBJECT,
  Regex: REGEX,
  Request: REQUEST,
  String: STRING
}

module.exports = TYPES;
