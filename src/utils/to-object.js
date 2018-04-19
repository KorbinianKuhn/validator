const { pickBy, isNotNil } = require("./lodash");

const RAML_TYPES = {
  any: {
    rename: {},
    whitelist: {}
  }
};

const removeUndefined = object => pickBy(object, isNotNil);

const convertToRamlType = (object, type) => {
  for (const key in type.rename) {
    if (key in object) {
      object[type.rename[key]] = object[key];
      delete object[key];
    }
  }

  for (const key in object) {
    if (!(key in type.whitelist)) {
      delete object[key];
    }
  }
};

const toRAML = object => {
  switch (object.type) {
    case "any":
      return convertToRamlType(object, RAML_TYPES.any);
    case "array":
      return convertToRamlType(object, RAML_TYPES.array);
    case "boolean":
      return convertToRamlType(object, RAML_TYPES.boolean);
    case "date":
      return convertToRamlType(object, RAML_TYPES.date);
    case "number":
      if (object.integer) {
        object.type = "integer";
      }
      return convertToRamlType(object, RAML_TYPES.number);
    case "object":
      return convertToRamlType(object, RAML_TYPES.object);
    case "string":
      return convertToRamlType(object, RAML_TYPES.string);
    default:
      return object;
  }
};

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
