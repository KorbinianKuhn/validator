const _ = require('lodash');
const ANY = require('./any').ANY;
const ObjectFactory = require('./object').ObjectFactory;
const {
  BODY_OPTIONS,
  QUERY_OPTIONS,
  URI_OPTIONS
} = require('../defaults');
const message = require('../message');
const helper = require('../helper');

const validateRequest = async (req, schema) => {
  if (!_.every(['params', 'query', 'body'], _.partial(_.has, req))) {
    throw new Error('Invalid express req object.');
  }

  const errors = {};

  if (schema._params) {
    try {
      req.params = await schema._params.validate(req.params);
    } catch (err) {
      errors.params = err;
    }
  } else if (schema._noUndefinedKeys) {
    if (_.keys(req.params).length > 0) {
      errors.params = message.get(schema._language, schema._messages, 'request', 'no_uri');
    }
  }

  if (schema._query) {
    try {
      req.query = await schema._query.validate(req.query);
    } catch (err) {
      errors.query = err;
    }
  } else if (schema._noUndefinedKeys) {
    if (_.keys(req.query).length > 0) {
      errors.query = message.get(schema._language, schema._messages, 'request', 'no_query');
    }
  }

  if (schema._body) {
    try {
      req.body = await schema._body.validate(req.body);
    } catch (err) {
      errors.body = err;
    }
  } else if (schema._noUndefinedKeys) {
    if (_.keys(req.body).length > 0) {
      errors.body = message.get(schema._language, schema._messages, 'request', 'no_body');
    }
  }

  if (_.keys(errors).length > 0) {
    throw errors;
  } else {
    return req;
  }
};

const validateSchema = (schema, options) => {
  if (!_.hasIn(schema, 'constructor.name')) {
    throw new Error('Invalid schema.');
  }

  if (['OBJECT', 'ARRAY'].indexOf(schema.constructor.name) === -1) {
    if (_.isPlainObject(schema)) {
      schema = ObjectFactory(schema, options);
    } else {
      throw new Error('Must be Object or Array Schema.');
    }
  }

  return schema;
};

class REQUEST extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
    this._noUndefinedKeys = _.defaultTo(options.noUndefinedKeys, defaults.noUndefinedKeys);
  }

  async validate(value) {
    return helper.validate(this._options.type, validateRequest(value, this));
  }

  params(schema, options = {}) {
    this._params = validateSchema(schema, _.defaults(options, _.pick(this._options, 'schema._language', 'type', 'schema._messages'), URI_OPTIONS));
    return this;
  }

  query(schema, options = {}) {
    this._query = validateSchema(schema, _.defaults(options, _.pick(this._options, 'schema._language', 'type', 'schema._messages'), QUERY_OPTIONS));
    return this;
  }

  body(schema, options = {}) {
    this._body = validateSchema(schema, _.defaults(options, _.pick(this._options, 'schema._language', 'type', 'schema._messages'), BODY_OPTIONS));
    return this;
  }

  toObject() {
    throw new Error('Not Implemented');
  }
}

exports.RequestFactory = (options, defaults) => new REQUEST(options, defaults);
