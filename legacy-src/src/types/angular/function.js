const { FUNCTION, validateFunction } = require('../function');

class FUNCTION_ANGULAR extends FUNCTION {
  constructor(func, options, defaults) {
    super(func, options, defaults);
  }

  validate() {
    return async formControl => {
      try {
        const value = formControl.value === '' ? null : formControl.value;
        await validateFunction(value, this);
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}

exports.FUNCTION_ANGULAR = FUNCTION_ANGULAR;
exports.FunctionFactory = (func, options, defaults) =>
  new FUNCTION_ANGULAR(func, options, defaults);
