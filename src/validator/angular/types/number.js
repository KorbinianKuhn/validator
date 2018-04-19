const { NUMBER } = require("./../../default/types/number");
const { validate, validateSync } = require("./../../default/validation/number");

class NUMBER_ANGULAR extends NUMBER {
  constructor(options, defaults) {
    super(options, defaults);
  }

  validate() {
    return async formControl => {
      try {
        const value = formControl.value === "" ? null : formControl.value;
        await validate(value, this);
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }

  validateSync() {
    return formControl => {
      try {
        const value = formControl.value === "" ? null : formControl.value;
        validateSync(value, this);
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}

exports.NUMBER_ANGULAR = NUMBER_ANGULAR;
exports.NumberFactory = (options, defaults) =>
  new NUMBER_ANGULAR(options, defaults);
