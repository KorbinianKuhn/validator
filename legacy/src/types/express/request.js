const _ = require('lodash');
const ANY = require('./../any').ANY;
const ObjectFactory = require('./../object').ObjectFactory;
const {
  BODY_OPTIONS,
  QUERY_OPTIONS,
  URI_OPTIONS
} = require('../../defaults');
const message = require('../../message');
const helper = require('../../helper');

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
    return message.get(requestSchema._language, requestSchema._messages, 'request', messageKey);
  }
  return null;
};
const validateRequest = async (req, schema) => {
  if (!_.every(['params', 'query', 'body'], _.partial(_.has, req))) {
    throw new Error('Invalid express req object.');
  }

  const errors = {};

  const params = await validateSchema(schema, req.params, schema._params, 'no_uri', schema._noUndefinedKeys);
  if (params) errors.params = params;

  const query = await validateSchema(schema, req.query, schema._query, 'no_query', schema._noUndefinedKeys);
  if (query) errors.query = query;

  const body = await validateSchema(schema, req.body, schema._body, 'no_body', schema._noUndefinedKeys);
  if (body) errors.body = body;

  if (_.keys(errors).length > 0) {
    throw errors;
  } else {
    return req;
  }
};

const toSchema = (schema, options, defaults) => {
  if (!_.hasIn(schema, 'constructor.name')) {
    throw new Error('Invalid schema.');
  }

  if (['OBJECT', 'ARRAY'].indexOf(schema.constructor.name) === -1) {
    if (_.isPlainObject(schema)) {
      schema = ObjectFactory(schema, options, defaults);
    } else {
      throw new Error('Must be Object or Array Schema.');
    }
  }

  return schema;
};

class REQUEST extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
    this._defaults = _.defaults(options, defaults);
    this._noUndefinedKeys = _.defaultTo(options.noUndefinedKeys, defaults.noUndefinedKeys);
  }

  async validate(value) {
    return validateRequest(value, this);
  }

  params(schema, options = {}) {
    this._params = toSchema(schema, options, _.defaults({}, URI_OPTIONS, this._defaults));
    return this;
  }

  query(schema, options = {}) {
    this._query = toSchema(schema, options, _.defaults({}, QUERY_OPTIONS, this._defaults));
    return this;
  }

  body(schema, options = {}) {
    this._body = toSchema(schema, options, _.defaults({}, BODY_OPTIONS, this._defaults));
    return this;
  }

  toObject(options = {}) {
    const params = this._params ? this._params.toObject(options).properties : undefined;
    const query = this._query ? this._query.toObject(options).properties : undefined;
    const body = this._body ? { "application/json": this._body.toObject(options) } : undefined;
    switch (options.type) {
      case 'raml': {
        return _.pickBy({
          description: this._description,
          uriParameters: params,
          queryParameters: query,
          body
        }, helper.isNotNil);
      }
      default: {
        return _.pickBy({
          type: 'request',
          required: this._required,
          name: this._name,
          description: this._description,
          default: this._default,
          example: this._example,
          examples: this._examples,
          params,
          query,
          body
        }, helper.isNotNil);
      }
    }
  }
}

exports.RequestFactory = (options, defaults) => new REQUEST(options, defaults);
