const { STRING } = require("./../../default/types/string");
const { validate, validateSync } = require("./../../default/validation/string");

class STRING_ANGULAR extends STRING {
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

exports.STRING_ANGULAR = STRING_ANGULAR;
exports.AnyFactory = (options, defaults) =>
  new STRING_ANGULAR(options, defaults);
