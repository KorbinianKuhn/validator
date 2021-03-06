const { ARRAY } = require('./../../default/types/array');
const { validate, validateSync } = require('./../../default/validation/array');

class ARRAY_ANGULAR extends ARRAY {
  constructor(type, options, defaults) {
    super(type, options, defaults);
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

exports.ARRAY_ANGULAR = ARRAY_ANGULAR;
exports.ArrayFactory = (type, options, defaults) =>
  new ARRAY_ANGULAR(type, options, defaults);
