const _ = require('./../../utils/lodash');
const { Validator } = require('./../default/validator');
const middleware = require('./middleware');

const TYPES = [
  'ANY',
  'ARRAY',
  'BOOLEAN',
  'DATE',
  'NUMBER',
  'OBJECT',
  'STRING',
  'REQUEST',
  'RESPONSE'
];

const { BODY_OPTIONS, QUERY_OPTIONS, URI_OPTIONS } = require('./options');

class ExpressValidator extends Validator {
  constructor(options) {
    options.messages = 'default';
    options.type = 'express';
    super(options);
    this._types = TYPES;
  }

  Request(options = {}) {
    return TYPES.Request(options, _.defaults({}, this._options));
  }

  Params(schema, options = {}) {
    return TYPES.Object(
      schema,
      options,
      _.defaults({}, URI_OPTIONS, this._options, this._defaults)
    );
  }

  Query(schema, options = {}) {
    return TYPES.Object(
      schema,
      options,
      _.defaults({}, QUERY_OPTIONS, this._options, this._defaults)
    );
  }

  Body(schema, options = {}) {
    if (_.isArray(schema)) {
      return TYPES.Array(
        schema,
        options,
        _.defaults({}, BODY_OPTIONS, this._options, this._defaults)
      );
    } else if (_.isPlainObject(schema)) {
      return TYPES.Object(
        schema,
        options,
        _.defaults({}, BODY_OPTIONS, this._options, this._defaults)
      );
    } else {
      throw new Error('Only plain object or array is allowed');
    }
  }

  Response(status, object, options = {}) {
    return TYPES.Response(
      status,
      object,
      options,
      _.defaults({}, this._options)
    );
  }

  middleware(options = {}) {
    return middleware(options);
  }
}

exports.ExpressValidatorFactory = (options = {}) =>
  new ExpressValidator(options);
