const _ = require('lodash');
const BASE = require('./base');
const OBJECT = require('./object')
const defaults = require('../defaults');

var _options = Symbol();
var _uri = Symbol();
var _query = Symbol();
var _body = Symbol();

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
    this[_options] = options || {};
  }

  async validate(req, options = {}) {

    if (!_.every(['params', 'query', 'body'], _.partial(_.has, req))) {
      throw new Error('Invalid express req object.');
    }

    options = _.defaults(this[_options], options);

    const errors = {}

    if (this[_uri]) {
      const opt = _.defaults(this[_uri].options, options);
      try {
        req.params = await this[_uri].schema.validate(req.params, opt);
      } catch (err) {
        errors.uri = err;
      }
    }

    if (this[_query]) {
      const opt = _.defaults(this[_query].options, options);
      try {
        req.query = await this[_query].schema.validate(req.query, opt);
      } catch (err) {
        errors.query = err;
      }
    }

    if (this[_body]) {
      const opt = _.defaults(this[_body].options, options);
      try {
        req.body = await this[_body].schema.validate(req.body, opt);
      } catch (err) {
        errors.body = err;
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

    this[_uri] = {
      schema,
      options: _.defaults(options, this[_options], defaults.URI_OPTIONS)
    }
    return this;
  }

  query(schema, options = {}) {
    schema = validateSchema(schema);

    this[_query] = {
      schema,
      options: _.defaults(options, this[_options], defaults.QUERY_OPTIONS)
    }
    return this;
  }

  body(schema, options = {}) {
    schema = validateSchema(schema);

    this[_body] = {
      schema,
      options: _.defaults(options, this[_options], defaults.BODY_OPTIONS)
    }
    return this;
  }
}

function RequestFactory(options) {
  return new REQUEST(options);
}
module.exports = RequestFactory;
