const { pickBy, isNotNil } = require("./lodash");

const removeUndefined = object => pickBy(object, isNotNil);

const toRAML = object => object;

exports.toObject = (object, options = {}) => {
  const values = removeUndefined(object);

  switch (options.type) {
    case "raml": {
      return toRAML(values);
    }
    default:
      return values;
  }
};
