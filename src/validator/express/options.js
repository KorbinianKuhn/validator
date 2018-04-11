exports.MIDDLEWARE_OPTIONS = {
  details: true,
  message: 'Bad request. Invalid input parameters and/or values.',
  next: false
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
