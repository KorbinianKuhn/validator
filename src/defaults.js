exports.TYPE_NAMES = ['ANY', 'ARRAY', 'BOOLEAN', 'DATE', 'ENUM', 'FUNCTION', 'INTEGER', 'NUMBER', 'OBJECT', 'REGEX',
  'REQUEST', 'STRING', 'RESPONSE'
];
const DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.SSSZ';
exports.DATE_FORMAT = DATE_FORMAT;

exports.VALIDATOR_OPTIONS = {
  language: 'en',
  messages: 'default',
  type: 'any',
  requiredAsDefault: true,
  throwValidationErrors: true,
  parseToType: true,
  noEmptyStrings: true,
  trimStrings: true,
  noEmptyArrays: true,
  noEmptyObjects: true,
  noUndefinedKeys: true,
  dateFormat: DATE_FORMAT,
  parseDates: true,
  utc: true,
  strictDateValidation: true
};

exports.URI_OPTIONS = {
  requiredAsDefault: true
};

exports.QUERY_OPTIONS = {
  requiredAsDefault: false
};

exports.BODY_OPTIONS = {
  requiredAsDefault: true
};

exports.ANY_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationError', 'parseToType'];
exports.ARRAY_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType', 'noEmptyArrays'];
exports.BOOLEAN_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType'];
exports.DATE_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType', 'dateFormat', 'parseDates', 'strictDateValidation', 'utc'];
exports.ENUM_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType'];
exports.FUNCTION_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType'];
exports.INTEGER_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType'];
exports.NUMBER_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType'];
exports.OBJECT_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType', 'noEmptyObjects', 'noUndefinedKeys'];
exports.REGEX_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType', 'noEmptyStrings', 'trimStrings'];
exports.STRING_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType', 'noEmptyStrings', 'trimStrings'];
