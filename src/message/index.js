const _ = require('lodash');

const messages = {
  array: require('./array.json'),
  date: require('./date.json'),
  enum: require('./enum.json'),
  generic: require('./generic.json'),
  integer: require('./integer.json'),
  number: require('./number.json'),
  object: require('./object.json'),
  regex: require('./regex.json'),
  request: require('./request.json'),
  string: require('./string.json')
};

const get = (language, validatorType, schemaType, error, ...replaceValues) => {
  language = language || 'en';
  validatorType = validatorType || 'default';
  let message = _.clone(_.get(messages, `${schemaType}.${error}.${validatorType}.${language}`));
  for (const replacer of replaceValues) {
    message = message.replace('$', replacer);
  }
  return message;
};
exports.get = get;

exports.required = (language, validatorType, value) => get(language, validatorType, 'generic', 'required', value);
exports.wrongType = (language, validatorType, schemaType, value) => get(language, validatorType, 'generic', 'wrong_type', schemaType, value);
