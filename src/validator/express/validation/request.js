const { keys, isObject } = require('./../../../utils/lodash');

const isValidRequestObject = (req, message) => {
  if (!isObject(req)) {
    throw message.get('express_invalid_request_object', {});
  }

  for (const key of ['params', 'query', 'body']) {
    if (!(key in req)) {
      throw message.get('express_invalid_request_object', {});
    }
  }
};

const validateSchema = async (value, schema, message, { unknown, type }) => {
  if (schema) {
    try {
      await schema.validate(value);
    } catch (err) {
      if (schema._required || keys(value).length > 0) {
        return err;
      }
    }
  } else if (!unknown && keys(value).length > 0) {
    return message.get(`express_unknown_${type}`);
  }
  return null;
};

const validateSchemaSync = (value, schema, message, { unknown, type }) => {
  if (schema) {
    try {
      schema.validateSync(value);
    } catch (err) {
      if (schema._required || keys(value).length > 0) {
        return err;
      }
    }
  } else if (!unknown && keys(value).length > 0) {
    return message.get(`express_unknown_${type}`);
  }
  return null;
};

const validateRequest = async (
  req,
  { params, query, body, unknown, message }
) => {
  isValidRequestObject(req, message);

  const errors = {};
  let valid = true;
  const keys = ['params', 'query', 'body'];
  const schemas = [params, query, body];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const error = await validateSchema(req[key], schemas[i], message, {
      unknown,
      type: key
    });

    if (error) {
      errors[key] = error;
      valid = false;
    }
  }

  if (valid) {
    return req;
  } else {
    throw errors;
  }
};

const validateRequestSync = (
  req,
  { params, query, body, unknown, message }
) => {
  isValidRequestObject(req, message);

  const errors = {};
  let valid = true;
  const keys = ['params', 'query', 'body'];
  const schemas = [params, query, body];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const error = validateSchemaSync(req[key], schemas[i], message, {
      unknown,
      type: key
    });

    if (error) {
      errors[key] = error;
      valid = false;
    }
  }

  if (valid) {
    return req;
  } else {
    throw errors;
  }
};

module.exports = {
  isValidRequestObject,
  validateSchema,
  validateSchemaSync,
  validateRequest,
  validateRequestSync
};
