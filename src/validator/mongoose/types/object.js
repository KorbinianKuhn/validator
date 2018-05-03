const { OBJECT } = require("./../../default/types/object");
const { validate, validateSync } = require("./../../default/validation/object");

class OBJECT_MONGOOSE extends OBJECT {
  constructor(schema, options, defaults) {
    super(schema, options, defaults);
  }

  validate() {
    return async value =>
      await validate(value, this.options({ validation: true }));
  }

  validateSync() {
    return value => validateSync(value, this.options({ validation: true }));
  }
}

exports.OBJECT_MONGOOSE = OBJECT_MONGOOSE;
exports.ObjectFactory = (schema, options, defaults) =>
  new OBJECT_MONGOOSE(schema, options, defaults);
