const { STRING } = require("./../../default/types/string");
const { validate, validateSync } = require("./../../default/validation/string");

class STRING_MONGOOSE extends STRING {
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

exports.STRING_MONGOOSE = STRING_MONGOOSE;
exports.StringFactory = (options, defaults) =>
  new STRING_MONGOOSE(options, defaults);
