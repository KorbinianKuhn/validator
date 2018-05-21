exports.MIDDLEWARE_OPTIONS = {
  details: true,
  next: false
};

const DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.SSSZ';
exports.DATE_FORMAT = DATE_FORMAT;

exports.TYPES = [
  'ANY',
  'ARRAY',
  'BOOLEAN',
  'DATE',
  'NUMBER',
  'OBJECT',
  'STRING',
  'REQUEST',
  'RESPONSE'
];

exports.VALIDATOR_OPTIONS = {
  locale: 'en',
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

exports.URI_OPTIONS = {};

exports.QUERY_OPTIONS = {
  requiredAsDefault: false,
  emptyObjects: true
};

exports.BODY_OPTIONS = {};
