const { INTEGER, validateInteger } = require('../integer');

class INTEGER_ANGULAR extends INTEGER {
  constructor(options, defaults) {
    super(options, defaults);
  }

  validate() {
    return async (formControl) => {
      try {
        await validateInteger(formControl.value, this);
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}

exports.INTEGER_ANGULAR = INTEGER_ANGULAR;
exports.IntegerFactory = (options, defaults) => new INTEGER_ANGULAR(options, defaults);
