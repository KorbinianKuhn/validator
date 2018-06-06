exports.MIDDLEWARE_OPTIONS = {
  details: true,
  next: false
};

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
  parseDates: true,
  utc: true
};

exports.URI_OPTIONS = {};

exports.QUERY_OPTIONS = {
  requiredAsDefault: false,
  emptyObjects: true
};

exports.BODY_OPTIONS = {};
