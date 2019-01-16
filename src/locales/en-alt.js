module.exports = {
  default: 'Invalid.',
  configuration_error: 'Validator configuration error',
  validation_error: 'Invalid input parameters and/or values.',
  unknown_locale: 'Unknown locale {{locale}}.',
  invalid_schema: 'Invalid schema.',
  unknown_schema: 'Unknown schema.',
  invalid_custom_type:
    'Cannot add custom type {{name}}. Invalid type {{type}}.',
  duplicate_custom_type:
    'Cannot add custom type. Name {{name}} is already set.',
  unknown_custom_type: 'Error getting custom type {{name}}. Unknown type.',
  no_example: 'No example provided',
  required: 'Required but is {{value}}.',
  not_null: 'Null is not allowed.',
  wrong_type: 'Must be type {{expected}} but is {{actual}}.',
  only: "Only '{{only}}' is allowed.",
  not: 'Is not allowed.',
  invalid_function: 'Must be a function.',
  invalid_regular_expression: 'Must be a regular expression.',
  string_empty: 'String must not be empty.',
  string_min: 'Must have at least {{expected}} characters.',
  string_max: 'Must have at most {{expected}} characters.',
  string_length: 'Must have exactly {{expected}} characters.',
  string_regex_invalid: 'Value does not match regular expression.',
  array_empty: 'The list must not be empty.',
  array_min: 'The list must have at least {{expected}} items.',
  array_max: 'The list must have at most {{expected}} items.',
  array_length: 'The list must have exactly {{expected}} items.',
  array_duplicate_items: 'The items must be unique.',
  number_wrong_type: 'Must be a number.',
  number_min: 'Must be at minimum {{expected}}.',
  number_max: 'Must be at maximum {{expected}}.',
  number_less: 'Must be less than {{expected}}.',
  number_greater: 'Must be greater than {{expected}}.',
  number_positive: 'Must be a positive number.',
  number_negative: 'Must be a negative number.',
  integer_wrong_type: 'Must be an integer.',
  integer_is_number: 'No decimal places allowed.',
  date_invalid: 'Is not a valid date.',
  date_min: 'Must be at minimum {{min}}.',
  date_max: 'Must be at maximum {{max}}.',
  object_invalid_type: 'Must be an object.',
  object_min: 'Must have at least {{expected}} keys.',
  object_max: 'Must have at most {{expected}} keys.',
  object_length: 'Must have exactly {{expected}} keys.',
  object_empty: 'Object is empty.',
  object_unknown: '{{key}} is an unknown key.',
  condition_gt: '{{keyA}} must be greater than {{keyB}}.',
  condition_gte: '{{keyA}} must be greater than or equal {{keyB}}.',
  condition_lt: '{{keyA}} must be less than {{keyB}}.',
  condition_lte: '{{keyA}} must be less than or equal {{keyB}}.',
  condition_equals: '{{keyA}} must equal {{keyB}}.',
  condition_not_equals: '{{keyA}} must not equal {{keyB}}.',
  condition_xor: 'Either {{keyA}} or {{keyB}} must be set.',
  condition_or: 'Either {{keyA}} or {{keyB}} can be set.',
  condition_depends_on: '{{keyA}} depends on {{keyB}}.',
  express_invalid_request_object: 'Invalid express req object.',
  express_unknown_params: 'URI parameters are not allowed.',
  express_unknown_query: 'Query parameters are not allowed.',
  express_unknown_body: 'Body parameters are not allowed.',
  express_object_or_array_schema: 'Must be object or array schema.',
  express_invalid_status_code:
    'Must have status code {{expected}} but has {{actual}}.'
};
