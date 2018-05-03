const { ANY } = require("./../../default/types/any");
const { validate, validateSync } = require("./../../default/validation/any");

class ANY_ANGULAR extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
  }

  validate() {
    return async formControl => {
      try {
        const value = formControl.value === "" ? null : formControl.value;
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
        const value = formControl.value === "" ? null : formControl.value;
        validateSync(value, this.options({ validation: true }));
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}

exports.ANY_ANGULAR = ANY_ANGULAR;
exports.AnyFactory = (options, defaults) => new ANY_ANGULAR(options, defaults);
