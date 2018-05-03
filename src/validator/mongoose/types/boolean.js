const { BOOLEAN } = require("./../../default/types/boolean");
const {
  validate,
  validateSync
} = require("./../../default/validation/boolean");

class BOOLEAN_MONGOOSE extends BOOLEAN {
  constructor(options, defaults) {
    super(options, defaults);
  }

  validate() {
    return async value =>
      await validate(value, this.options({ validation: true }));
  }

  validateSync() {
    return value => validateSync(value, this.options({ validation: true }));
  }
}

exports.BOOLEAN_MONGOOSE = BOOLEAN_MONGOOSE;
exports.BooleanFactory = (options, defaults) =>
  new BOOLEAN_MONGOOSE(options, defaults);
