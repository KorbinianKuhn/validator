const _ = require('lodash');
const BASE = require('./base');
const OBJECT = require('./object');
const defaults = require('../defaults');

const message = require('../message');
const helper = require('../helper');

const _private = Symbol('Private variables');

const validateRequest = async (req, privates, options) => {
  if (!_.every(['params', 'query', 'body'], _.partial(_.has, req))) {
    throw new Error('Invalid express req object.');
  }

  const errors = {};

  if (privates.params) {
    const opt = _.defaults(privates.params.options, options);
    try {
      req.params = await privates.params.schema.validate(req.params, opt);
    } catch (err) {
      errors.params = err;
    }
  } else if (options.noUndefinedKeys) {
    if (_.keys(req.params).length > 0) {
      errors.params = message.get(options.language, options.type, 'request', 'no_uri');
    }
  }

  if (privates.query) {
    const opt = _.defaults(privates.query.options, options);
    try {
      req.query = await privates.query.schema.validate(req.query, opt);
    } catch (err) {
      errors.query = err;
    }
  } else if (options.noUndefinedKeys) {
    if (_.keys(req.query).length > 0) {
      errors.query = message.get(options.language, options.type, 'request', 'no_query');
    }
  }

  if (privates.body) {
    if (privates.body.schema.isRequired() || _.keys(req.body).length !== 0) {
      const opt = _.defaults(privates.body.options, options);
      try {
        req.body = await privates.body.schema.validate(req.body, opt);
      } catch (err) {
        errors.body = err;
      }
    }
  } else if (options.noUndefinedKeys) {
    if (_.keys(req.body).length > 0) {
      errors.body = message.get(options.language, options.type, 'request', 'no_body');
    }
  }

  if (_.keys(errors).length > 0) {
    throw errors;
  } else {
    return req;
  }
};

const validateSchema = (schema, required) => {
  if (!_.hasIn(schema, 'constructor.name')) {
    throw new Error('Invalid schema.');
  }

  if (['OBJECT', 'ARRAY'].indexOf(schema.constructor.name) === -1) {
    if (_.isPlainObject(schema)) {
      schema = OBJECT(schema);
    } else {
      throw new Error('Must be OBJECT or ARRAY Schema.');
    }
  }

  if (required && !schema.hasRequiredProperty()) {
    schema.required(required);
  }

  return schema;
};

class REQUEST extends BASE {
  constructor(options) {
    super();
    this[_private] = {};
    this[_private].options = options || {};
  }

  async validate(req, options = {}) {
    options = _.defaults(this[_private].options, options);

    const func = validateRequest(req, {
      params: this[_private].params,
      query: this[_private].query,
      body: this[_private].body,
    }, options);

    return helper.validate(options.type, func);
  }

  params(schema, options = {}) {
    schema = validateSchema(schema, true);

    this[_private].params = {
      schema,
      options: _.defaults(options, this[_private].options, defaults.URI_OPTIONS)
    };
    return this;
  }

  query(schema, options = {}) {
    schema = validateSchema(schema, false);

    this[_private].query = {
      schema,
      options: _.defaults(options, this[_private].options, defaults.QUERY_OPTIONS)
    };
    return this;
  }

  body(schema, options = {}) {
    schema = validateSchema(schema, true);

    this[_private].body = {
      schema,
      options: _.defaults(options, this[_private].options, defaults.BODY_OPTIONS)
    };
    return this;
  }
}

function RequestFactory(options) {
  return new REQUEST(options);
}
module.exports = RequestFactory;
