const { DATE } = require("./../../default/types/date");
const { validate, validateSync } = require("./../../default/validation/date");

class DATE_MONGOOSE extends DATE {
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

exports.DATE_MONGOOSE = DATE_MONGOOSE;
exports.DateFactory = (options, defaults) =>
  new DATE_MONGOOSE(options, defaults);
