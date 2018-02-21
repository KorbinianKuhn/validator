const { ANY, validateAny } = require('../any');

class ANY_ANGULAR extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
  }

  validate() {
    return async (formControl) => {
      try {
        await validateAny(formControl.value, this);
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}

exports.ANY_ANGULAR = ANY_ANGULAR;
exports.AnyFactory = (options, defaults) => new ANY_ANGULAR(options, defaults);
