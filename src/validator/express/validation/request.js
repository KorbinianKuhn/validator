const { _ } = require('./../../../utils/lodash');

const validateSchema = async (requestSchema, values, schema, messageKey) => {
  if (schema) {
    if (schema._required || _.keys(values).length > 0) {
      try {
        await schema.validate(values);
        return null;
      } catch (err) {
        return err;
      }
    } else {
      // Try validation to get default values if set
      try {
        await schema.validate(values);
        return null;
      } catch (err) {
        return null;
      }
    }
  } else if (requestSchema._noUndefinedKeys && _.keys(values).length > 0) {
    return message.get(
      requestSchema._language,
      requestSchema._messages,
      'request',
      messageKey
    );
  }
  return null;
};

const validateRequest = async (req, schema) => {
  if (!_.every(['params', 'query', 'body'], _.partial(_.has, req))) {
    throw new Error('Invalid express req object.');
  }

  const errors = {};

  const params = await validateSchema(
    schema,
    req.params,
    schema._params,
    'no_uri',
    schema._noUndefinedKeys
  );
  if (params) errors.params = params;

  const query = await validateSchema(
    schema,
    req.query,
    schema._query,
    'no_query',
    schema._noUndefinedKeys
  );
  if (query) errors.query = query;

  const body = await validateSchema(
    schema,
    req.body,
    schema._body,
    'no_body',
    schema._noUndefinedKeys
  );
  if (body) errors.body = body;

  if (_.keys(errors).length > 0) {
    throw errors;
  } else {
    return req;
  }
};
