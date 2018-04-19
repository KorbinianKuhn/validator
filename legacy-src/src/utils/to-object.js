const _ = require("lodash");

const isNotNil = value => !_.isNil(value);

const removeUndefined = object => _.pickBy(object, isNotNil);

const toRAML = (object, options) => object;

exports.toObject = (object, options = {}) => {
  const values = removeUndefined();
  console.log(values);
  switch (options.type) {
    case "raml": {
      return toRAML(values, options);
    }
    default:
      return values;
  }
};
