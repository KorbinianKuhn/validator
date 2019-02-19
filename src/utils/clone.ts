import { clone, cloneRegex } from './lodash';

export const cloneSchema = (schema: any): any => {
  const clonedSchema = Object.create(Object.getPrototypeOf(schema));

  Object.getOwnPropertyNames(schema).forEach(key => {
    switch (key) {
      case '_message':
        clonedSchema._message = schema._message;
        break;
      case '_func':
      case '_object_func': {
        clonedSchema._func = schema._func;
        break;
      }
      case '_regex':
        clonedSchema._regex = {
          pattern: cloneRegex(schema._regex.pattern),
          locales: schema._regex.locales
        };
        break;
      case '_type':
      case '_body':
      case '_query':
      case '_params':
        clonedSchema[key] = schema[key].clone();
        break;
      case '_object': {
        clonedSchema._object = {};
        Object.keys(schema._object).map(k => {
          clonedSchema._object[k] = schema._object[k].clone();
        });
        break;
      }
      default:
        clonedSchema[key] = clone(schema[key]);
    }
  });

  return clonedSchema;
};
