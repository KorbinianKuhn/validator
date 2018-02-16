const _ = require('lodash');

const MESSAGES = {
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

const get = (language, messages, schemaType, error, ...replaceValues) => {
  language = language || 'en';
  messages = messages || 'default';
  let message = _.clone(_.get(MESSAGES, `${schemaType}.${error}.${messages}.${language}`));
  for (const replacer of replaceValues) {
    message = message.replace('$', replacer);
  }
  return message;
};
exports.get = get;

exports.required = (language, messages, value) => get(language, messages, 'generic', 'required', value);
exports.wrongType = (language, messages, schemaType, value) => get(language, messages, 'generic', 'wrong_type', schemaType, value);
