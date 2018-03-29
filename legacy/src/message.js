const _ = require('lodash');

const MESSAGES = {
  array: require('./locales/array.json'),
  date: require('./locales/date.json'),
  enum: require('./locales/enum.json'),
  generic: require('./locales/generic.json'),
  integer: require('./locales/integer.json'),
  number: require('./locales/number.json'),
  object: require('./locales/object.json'),
  regex: require('./locales/regex.json'),
  request: require('./locales/request.json'),
  string: require('./locales/string.json')
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
