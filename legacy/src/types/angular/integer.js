const { INTEGER, validateInteger } = require('../integer');

class INTEGER_ANGULAR extends INTEGER {
  constructor(options, defaults) {
    super(options, defaults);
  }

  validate() {
    return async (formControl) => {
      try {
        const value = formControl.value === '' ? null : formControl.value;
        await validateInteger(value, this);
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}

exports.INTEGER_ANGULAR = INTEGER_ANGULAR;
exports.IntegerFactory = (options, defaults) => new INTEGER_ANGULAR(options, defaults);
