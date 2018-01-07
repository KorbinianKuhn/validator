exports.TYPE_NAMES = ['ARRAY', 'BOOLEAN', 'ENUM', 'FUNCTION', 'INTEGER', 'NUMBER', 'OBJECT', 'REGEX', 'REQUEST', 'STRING'];

exports.VALIDATOR_OPTIONS = {
  requiredAsDefault: true,
  throwValidationErrors: true,
  parseToType: false,
  noEmptyStrings: true,
  trimStrings: true,
  noEmptyArrays: true,
  noEmptyObjects: true
}

exports.URI_OPTIONS = {
  requiredAsDefault: true,
  parseToType: true,
  noEmptyStrings: true,
  trimStrings: true,
  noEmptyArrays: true,
}

exports.QUERY_OPTIONS = {
  requiredAsDefault: false,
  parseToType: true,
  noEmptyStrings: true,
  trimStrings: true,
  noEmptyArrays: true,
}

exports.BODY_OPTIONS = {
  requiredAsDefault: true,
  parseToType: false,
  noEmptyStrings: true,
  trimStrings: true,
  noEmptyArrays: true,
  noEmptyObjects: true
}
