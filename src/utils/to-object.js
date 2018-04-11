const _ = require('./lodash');

const removeUndefined = object => _.pickBy(object, _.isNotNil);

const toRAML = (object, options) => object;

exports.toObject = (object, options = {}) => {
  const values = removeUndefined(object);

  switch (options.type) {
    case 'raml': {
      return toRAML(values, options);
    }
    default:
      return values;
  }
};
