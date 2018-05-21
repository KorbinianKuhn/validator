const { ANY } = require('./../../default/types/any');
const { validate, validateSync } = require('./../../default/validation/any');

class ANY_MONGOOSE extends ANY {
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

exports.ANY_MONGOOSE = ANY_MONGOOSE;
exports.AnyFactory = (options, defaults) => new ANY_MONGOOSE(options, defaults);
