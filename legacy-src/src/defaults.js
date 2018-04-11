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
  requiredAsDefault: false,
  noEmptyObjects: false
};

exports.BODY_OPTIONS = {
  requiredAsDefault: true
};
