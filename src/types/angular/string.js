const { STRING, validateString } = require('../string');

class STRING_ANGULAR extends STRING {
  constructor(options, defaults) {
    super(options, defaults);
  }

  validate() {
    return async (formControl) => {
      try {
        await validateString(formControl.value, this);
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}

exports.STRING_ANGULAR = STRING_ANGULAR;
exports.StringFactory = (options, defaults) => new STRING_ANGULAR(options, defaults);
