const { keys } = require("./../../../utils/lodash");

const isValidRequestObject = (req, message) => {
  for (const key of ["params", "query", "body"]) {
    if (!(key in req)) {
      throw message.get("express_invalid_request_object", { key });
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

const validateRequest = async (req, message, schema, { unknown }) => {
  isValidRequestObject(req, message);

  const errors = {};
  let valid = true;
  for (const key of ["params", "query", "body"]) {
    const error = await validateSchema(req[key], schema[`_${key}`], {
      unknown: unknown,
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

const validateRequestSync = (req, message, schema, { unknown }) => {
  isValidRequestObject(req, message);

  const errors = {};
  let valid = true;
  for (const key of ["params", "query", "body"]) {
    const error = validateSchema(req[key], schema[`_${key}`], {
      unknown: unknown,
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
