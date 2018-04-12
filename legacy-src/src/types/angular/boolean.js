const { BOOLEAN, validateBoolean } = require('../boolean');

class BOOLEAN_ANGULAR extends BOOLEAN {
  constructor(options, defaults) {
    super(options, defaults);
  }

  validate() {
    return async formControl => {
      try {
        const value = formControl.value === '' ? null : formControl.value;
        await validateBoolean(value, this);
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}

exports.BOOLEAN_ANGULAR = BOOLEAN_ANGULAR;
exports.BooleanFactory = (options, defaults) =>
  new BOOLEAN_ANGULAR(options, defaults);