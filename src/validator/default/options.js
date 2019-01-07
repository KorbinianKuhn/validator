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

exports.TYPES = [
  'ANY',
  'ARRAY',
  'BOOLEAN',
  'DATE',
  'NUMBER',
  'OBJECT',
  'STRING'
];
