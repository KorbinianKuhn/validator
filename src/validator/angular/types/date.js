const { DATE } = require('./../../default/types/date');
const { validate, validateSync } = require('./../../default/validation/date');

class DATE_ANGULAR extends DATE {
  constructor(options, defaults) {
    super(options, defaults);
  }

  validate() {
    return async formControl => {
      try {
        const value = formControl.value === '' ? null : formControl.value;
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
        const value = formControl.value === '' ? null : formControl.value;
        validateSync(value, this.options({ validation: true }));
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}

exports.DATE_ANGULAR = DATE_ANGULAR;
exports.DateFactory = (options, defaults) =>
  new DATE_ANGULAR(options, defaults);
