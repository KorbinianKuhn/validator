const { BOOLEAN } = require('./../../default/types/boolean');
const {
  validate,
  validateSync
} = require('./../../default/validation/boolean');

class BOOLEAN_ANGULAR extends BOOLEAN {
  constructor(options, defaults) {
    super(options, defaults);
  }

  validate() {
    return async formControl => {
      try {
        const value = formControl.value === '' ? undefined : formControl.value;
        await validate(value, this.options({ validation: true }));
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }

  validateSync() {
    return formControl => {
      try {
        const value = formControl.value === '' ? undefined : formControl.value;
        validateSync(value, this.options({ validation: true }));
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
