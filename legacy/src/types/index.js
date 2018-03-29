exports.TYPE_NAMES = ['ANY', 'ARRAY', 'BOOLEAN', 'DATE', 'ENUM', 'FUNCTION', 'INTEGER', 'NUMBER', 'OBJECT', 'REGEX',
  'STRING',];

const TYPES = {
  Any: require('./any').AnyFactory,
  Array: require('./array').ArrayFactory,
  Boolean: require('./boolean').BooleanFactory,
  Date: require('./date').DateFactory,
  Enum: require('./enum').EnumFactory,
  Function: require('./function').FunctionFactory,
  Integer: require('./integer').IntegerFactory,
  Number: require('./number').NumberFactory,
  Object: require('./object').ObjectFactory,
  Regex: require('./regex').RegexFactory,
  String: require('./string').StringFactory
};
exports.TYPES = TYPES;
