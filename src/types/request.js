const _ = require('lodash');
const BASE = require('./base');
const OBJECT = require('./object')
const defaults = require('../defaults');

var _private = Symbol();

const validateSchema = (schema) => {
  if (!_.hasIn(schema, 'constructor.name')) {
    throw new Error('Invalid schema.');
  }

  if (['OBJECT', 'ARRAY'].indexOf(schema.constructor.name) === -1) {
    if (_.isPlainObject(schema)) {
      return OBJECT(schema);
    } else {
      throw new Error('Must be OBJECT or ARRAY Schema.');
    }
  }

  return schema;
}

class REQUEST extends BASE {
  constructor(options) {
    super();
    this[_private] = {};
    this[_private].options = options || {};
  }

  async validate(req, options = {}) {

    if (!_.every(['params', 'query', 'body'], _.partial(_.has, req))) {
      throw new Error('Invalid express req object.');
    }

    options = _.defaults(this[_private].options, options);

    const errors = {}

    if (this[_private].uri) {
      const opt = _.defaults(this[_private].uri.options, options);
      try {
        req.params = await this[_private].uri.schema.validate(req.params, opt);
      } catch (err) {
        errors.uri = err;
      }
    } else if (options.noUndefinedKeys) {
      if (_.keys(req.params).length > 0) {
        errors.uri = 'No uri parameters allowed.';
      }
    }

    if (this[_private].query) {
      const opt = _.defaults(this[_private].query.options, options);
      try {
        req.query = await this[_private].query.schema.validate(req.query, opt);
      } catch (err) {
        errors.query = err;
      }
    } else if (options.noUndefinedKeys) {
      if (_.keys(req.query).length > 0) {
        errors.query = 'No query parameters allowed.';
      }
    }

    if (this[_private].body) {
      if (this[_private].body.schema.isRequired() || _.keys(req.body).length !== 0) {
        const opt = _.defaults(this[_private].body.options, options);
        try {
          req.body = await this[_private].body.schema.validate(req.body, opt);
        } catch (err) {
          errors.body = err;
        }
      }
    } else if (options.noUndefinedKeys) {
      if (_.keys(req.body).length > 0) {
        errors.body = 'No body parameters allowed.';
      }
    }

    if (_.keys(errors).length > 0) {
      throw errors;
    } else {
      return req;
    }
  }

  uri(schema, options = {}) {
    schema = validateSchema(schema);

    this[_private].uri = {
      schema,
      options: _.defaults(options, this[_private].options, defaults.URI_OPTIONS)
    }
    return this;
  }

  query(schema, options = {}) {
    schema = validateSchema(schema);

    this[_private].query = {
      schema,
      options: _.defaults(options, this[_private].options, defaults.QUERY_OPTIONS)
    }
    return this;
  }

  body(schema, options = {}) {
    schema = validateSchema(schema);

    this[_private].body = {
      schema,
      options: _.defaults(options, this[_private].options, defaults.BODY_OPTIONS)
    }
    return this;
  }
}

function RequestFactory(options) {
  return new REQUEST(options);
}
module.exports = RequestFactory;
