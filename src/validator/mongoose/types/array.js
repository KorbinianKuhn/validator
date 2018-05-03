const { ARRAY } = require("./../../default/types/array");
const { validate, validateSync } = require("./../../default/validation/array");

class ARRAY_MONGOOSE extends ARRAY {
  constructor(type, options, defaults) {
    super(type, options, defaults);
  }

  validate() {
    return async value =>
      await validate(value, this.options({ validation: true }));
  }

  validateSync() {
    return value => validateSync(value, this.options({ validation: true }));
  }
}

exports.ARRAY_MONGOOSE = ARRAY_MONGOOSE;
exports.ArrayFactory = (type, options, defaults) =>
  new ARRAY_MONGOOSE(type, options, defaults);
