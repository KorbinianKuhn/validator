const { NUMBER } = require("./../../default/types/number");
const { validate, validateSync } = require("./../../default/validation/number");

class NUMBER_MONGOOSE extends NUMBER {
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

exports.NUMBER_MONGOOSE = NUMBER_MONGOOSE;
exports.NumberFactory = (options, defaults) =>
  new NUMBER_MONGOOSE(options, defaults);
