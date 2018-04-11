const { DATE, validateDate } = require('../date');

class DATE_ANGULAR extends DATE {
  constructor(options, defaults) {
    super(options, defaults);
  }

  validate() {
    return async formControl => {
      try {
        const value = formControl.value === '' ? null : formControl.value;
        await validateDate(value, this);
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
