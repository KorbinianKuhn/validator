const { ARRAY, validateArray } = require('../array');

class ARRAY_ANGULAR extends ARRAY {
  constructor(type, options, defaults) {
    super(type, options, defaults);
  }

  validate() {
    return async (formControl) => {
      try {
        await validateArray(formControl.value, this);
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}

exports.ARRAY_ANGULAR = ARRAY_ANGULAR;
exports.ArrayFactory = (type, options, defaults) => new ARRAY_ANGULAR(type, options, defaults);
