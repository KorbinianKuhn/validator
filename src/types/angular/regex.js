const { REGEX, validateRegex } = require('../regex');

class REGEX_ANGULAR extends REGEX {
  constructor(regex, options, defaults) {
    super(regex, options, defaults);
  }

  validate() {
    return async (formControl) => {
      try {
        const value = formControl.value === '' ? null : formControl.value;
        await validateRegex(value, this);
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}

exports.REGEX_ANGULAR = REGEX_ANGULAR;
exports.RegexFactory = (regex, options, defaults) => new REGEX_ANGULAR(regex, options, defaults);