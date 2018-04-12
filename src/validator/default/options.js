const DATE_FORMAT = (exports.DATE_FORMAT = "YYYY-MM-DD[T]HH:mm:ss.SSSZ");

exports.VALIDATOR_OPTIONS = {
  language: "en",
  messages: "default",
  type: "any",
  requiredAsDefault: true,
  throwValidationErrors: true,
  parseToType: true,
  emptyStrings: false,
  trimStrings: true,
  emptyArrays: false,
  emptyObjects: false,
  unknownObjectKeys: false,
  dateFormat: DATE_FORMAT,
  parseDates: true,
  utc: true,
  strictDateValidation: true
};
