import { isUndefined, isNull, isNotUndefined, isString } from '../../../utils';
import { validateOnly, validateNot, validateFunctionSync, validateFunctionAsync } from './any';

export const validateString = (
  value,
  { defaultValue, allowed, required, message, trim, empty, min, max, length, regex, not, only, nullAsUndefined }
) => {
  if (isUndefined(value) || (nullAsUndefined && isNull(value))) {
    if (isNotUndefined(defaultValue)) {
      return defaultValue;
    }
    if (required) {
      throw message.get('required', { value });
    } else {
      return undefined;
    }
  }

  if (allowed && allowed.indexOf(value) !== -1) {
    return value;
  }

  if (value === null) {
    throw message.get('not_null', { value });
  }

  if (!isString(value)) {
    throw message.get('wrong_type', {
      expected: 'string',
      actual: typeof value
    });
  }

  if (trim) {
    value = value.trim();
  }

  if (value === '') {
    if (empty === false) {
      throw message.get('string_empty');
    } else {
      return value;
    }
  }

  validateOnly(only, value, message);
  validateNot(not, value, message);

  if (min || max || length) {
    const stringLength = value.length;
    if (min && stringLength < min) {
      throw message.get('string_min', {
        expected: min,
        actual: stringLength
      });
    }

    if (max && stringLength > max) {
      throw message.get('string_max', {
        expected: max,
        actual: stringLength
      });
    }

    if (length && stringLength !== length) {
      throw message.get('string_length', {
        expected: length,
        actual: stringLength
      });
    }
  }

  if (regex && !value.match(regex.pattern)) {
    const locale = message.getLocale();
    if (locale in regex.locales) {
      throw message.replace(regex.locales[locale], {
        pattern: regex.pattern,
        value
      });
    } else {
      throw message.get('string_regex_invalid', {});
    }
  }

  return value;
};

export const validateStringSync = (
  value,
  {
    defaultValue,
    allowed,
    required,
    message,
    parse,
    trim,
    empty,
    min,
    max,
    length,
    regex,
    not,
    only,
    func,
    nullAsUndefined
  }
) => {
  value = validateString(value, {
    defaultValue,
    allowed,
    required,
    message,
    trim,
    empty,
    min,
    max,
    length,
    regex,
    not,
    only,
    nullAsUndefined
  });
  return validateFunctionSync(func, value);
};

export const validateStringAsync = async (
  value,
  { defaultValue, allowed, required, message, trim, empty, min, max, length, regex, not, only, func, nullAsUndefined }
) => {
  value = validateString(value, {
    defaultValue,
    allowed,
    required,
    message,
    trim,
    empty,
    min,
    max,
    length,
    regex,
    not,
    only,
    nullAsUndefined
  });
  return validateFunctionAsync(func, value);
};
