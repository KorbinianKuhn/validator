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
  utc: true,
  nullAsUndefined: true
};

exports.TYPES = [
  'ANY_ANGULAR',
  'ARRAY_ANGULAR',
  'BOOLEAN_ANGULAR',
  'DATE_ANGULAR',
  'NUMBER_ANGULAR',
  'OBJECT_ANGULAR',
  'STRING_ANGULAR'
];
