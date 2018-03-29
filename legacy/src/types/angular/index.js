exports.TYPE_NAMES = ['ANY_ANGULAR', 'ARRAY_ANGULAR', 'BOOLEAN_ANGULAR', 'DATE_ANGULAR', 'ENUM_ANGULAR',
  'FUNCTION_ANGULAR', 'INTEGER_ANGULAR', 'NUMBER_ANGULAR', 'OBJECT_ANGULAR', 'REGEX_ANGULAR', 'STRING_ANGULAR',];

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
