exports.TYPE_NAMES = ['ANY', 'ARRAY', 'BOOLEAN', 'DATE', 'ENUM', 'FUNCTION', 'INTEGER', 'NUMBER', 'OBJECT', 'REGEX',
  'STRING', 'REQUEST', 'RESPONSE'];

const TYPES = {
  Any: require('./../any').AnyFactory,
  Array: require('./../array').ArrayFactory,
  Boolean: require('./../boolean').BooleanFactory,
  Date: require('./../date').DateFactory,
  Enum: require('./../enum').EnumFactory,
  Function: require('./../function').FunctionFactory,
  Integer: require('./../integer').IntegerFactory,
  Number: require('./../number').NumberFactory,
  Object: require('./../object').ObjectFactory,
  Regex: require('./../regex').RegexFactory,
  Request: require('./request').RequestFactory,
  Response: require('./response').ResponseFactory,
  String: require('./../string').StringFactory
};
exports.TYPES = TYPES;
