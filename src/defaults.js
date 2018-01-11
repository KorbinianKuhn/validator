exports.TYPE_NAMES = ['ARRAY', 'BOOLEAN', 'DATE', 'ENUM', 'FUNCTION', 'INTEGER', 'NUMBER', 'OBJECT', 'REGEX', 'REQUEST',
  'STRING'
];
const DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss';
exports.DATE_FORMAT = DATE_FORMAT;

exports.VALIDATOR_OPTIONS = {
  requiredAsDefault: true,
  throwValidationErrors: true,
  parseToType: false,
  noEmptyStrings: true,
  trimStrings: true,
  noEmptyArrays: true,
  noEmptyObjects: true,
  dateFormat: DATE_FORMAT
}

exports.URI_OPTIONS = {
  requiredAsDefault: true,
  parseToType: true,
  noEmptyStrings: true,
  trimStrings: true,
  noEmptyArrays: true,
  noEmptyObjects: true,
  dateFormat: DATE_FORMAT
}

exports.QUERY_OPTIONS = {
  requiredAsDefault: false,
  parseToType: true,
  noEmptyStrings: true,
  trimStrings: true,
  noEmptyArrays: true,
  noEmptyObjects: false,
  dateFormat: DATE_FORMAT
}

exports.BODY_OPTIONS = {
  requiredAsDefault: true,
  parseToType: false,
  noEmptyStrings: true,
  trimStrings: true,
  noEmptyArrays: true,
  noEmptyObjects: true,
  dateFormat: DATE_FORMAT
}
