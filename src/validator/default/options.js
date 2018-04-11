const DATE_FORMAT = (exports.DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');

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
