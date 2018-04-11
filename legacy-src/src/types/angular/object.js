const { OBJECT, validateObject } = require('../object');

class OBJECT_ANGULAR extends OBJECT {
  constructor(object, options, defaults) {
    super(object, options, defaults);
  }

  validate() {
    return async formControl => {
      try {
        const value = formControl.value === '' ? null : formControl.value;
        await validateObject(value, this);
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}

exports.OBJECT_ANGULAR = OBJECT_ANGULAR;
exports.ObjectFactory = (object, options, defaults) =>
  new OBJECT_ANGULAR(object, options, defaults);
