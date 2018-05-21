const { pickBy, isNotNil } = require('./lodash');

const RAML_TYPES = {
  any: {
    rename: { only: 'enum' },
    whitelist: ['type', 'description', 'required', 'default', 'example', 'enum']
  },
  array: {
    rename: {
      only: 'enum',
      unique: 'uniqueItems',
      min: 'minItems',
      max: 'maxItems'
    },
    whitelist: [
      'type',
      'description',
      'required',
      'default',
      'example',
      'enum',
      'items',
      'uniqueItems',
      'minItems',
      'maxItems'
    ]
  },
  boolean: {
    rename: { only: 'enum' },
    whitelist: ['type', 'description', 'required', 'default', 'example', 'enum']
  },
  date: {
    rename: { only: 'enum' },
    whitelist: ['type', 'description', 'required', 'default', 'example', 'enum']
  },
  number: {
    rename: { only: 'enum', min: 'minimum', max: 'maximum' },
    whitelist: [
      'type',
      'description',
      'required',
      'default',
      'example',
      'enum',
      'minimum',
      'maximum'
    ]
  },
  object: {
    rename: { only: 'enum', min: 'minProperties', max: 'maxProperties' },
    whitelist: [
      'type',
      'description',
      'required',
      'default',
      'example',
      'enum',
      'minProperties',
      'maxProperties',
      'properties'
    ]
  },
  string: {
    rename: { only: 'enum', min: 'minLength', max: 'maxLength' },
    whitelist: [
      'type',
      'description',
      'required',
      'default',
      'example',
      'enum',
      'pattern',
      'minLength',
      'maxLength'
    ]
  }
};

const removeUndefined = object => pickBy(object, isNotNil);

const convertToRamlType = (object, type) => {
  for (const src in type.rename) {
    if (src in object) {
      const dst = type.rename[src];
      object[dst] = object[src];
      delete object[src];
    }
  }

  for (const key in object) {
    if (type.whitelist.indexOf(key) === -1) {
      delete object[key];
    }
  }

  return object;
};

const toRAML = object => {
  switch (object.type) {
    case 'any':
      return convertToRamlType(object, RAML_TYPES.any);
    case 'array':
      return convertToRamlType(object, RAML_TYPES.array);
    case 'boolean':
      return convertToRamlType(object, RAML_TYPES.boolean);
    case 'date':
      object.type = 'datetime';
      return convertToRamlType(object, RAML_TYPES.date);
    case 'number':
      if (object.integer) {
        object.type = 'integer';
      }
      return convertToRamlType(object, RAML_TYPES.number);
    case 'object':
      return convertToRamlType(object, RAML_TYPES.object);
    case 'string':
      return convertToRamlType(object, RAML_TYPES.string);
    case 'request':
      return removeUndefined({
        description: object.description,
        uriParameters: object.params ? object.params.properties : undefined,
        queryParameters: object.query ? object.query.properties : undefined,
        body: object.body ? { 'application/json': object.body } : undefined
      });
    case 'response': {
      return {
        [object.status]: removeUndefined({
          description: object.description,
          body: object.body ? { 'application/json': object.body } : undefined
        })
      };
    }
    default:
      return object;
  }
};

exports.toObject = (object, options = {}) => {
  const values = removeUndefined(object);

  switch (options.type) {
    case 'raml': {
      return toRAML(values);
    }
    default:
      return values;
  }
};
