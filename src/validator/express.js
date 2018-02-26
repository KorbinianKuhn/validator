const _ = require('lodash');
const Validator = require('./any').Validator;
const { TYPES, TYPE_NAMES } = require('../types/express');
const { BODY_OPTIONS, QUERY_OPTIONS, URI_OPTIONS } = require('../defaults');

const DEFAULTS = {
  details: true,
  message: 'Bad request. Invalid input parameters and/or values.',
  next: false,
};

class ExpressValidator extends Validator {
  constructor(options) {
    options.messages = 'default';
    options.type = 'express';
    super(options);
    this._types = TYPE_NAMES;
  }

  Request(options = {}) {
    return TYPES.Request(options, this._options);
  }

  Params(schema, options = {}) {
    return TYPES.Object(schema, options, _.defaults(URI_OPTIONS, this._options, this._defaults));
  }

  Query(schema, options = {}) {
    return TYPES.Object(schema, options, _.defaults(QUERY_OPTIONS, this._options, this._defaults));
  }

  Body(schema, options = {}) {
    if (_.isArray(schema)) {
      return TYPES.Array(schema, options, _.defaults(BODY_OPTIONS, this._options, this._defaults));
    } else if (_.isPlainObject(schema)) {
      return TYPES.Object(schema, options, _.defaults(BODY_OPTIONS, this._options, this._defaults));
    } else {
      throw new Error('Only plain object or array is allowed');
    }
  }

  Response(status, object, options = {}) {
    return TYPES.Response(status, object, options, this._options);
  }

  middleware(options = {}) {
    const details = _.has(options, 'details') ? options.details : DEFAULTS.details;
    const message = _.has(options, 'message') ? options.message : DEFAULTS.message;
    const nextError = _.has(options, 'next') ? options.next : DEFAULTS.next;

    return (err, req, res, next) => {
      if (err.name === 'ValidationError' && err.type === 'validator') {
        const response = {
          error: true,
          message,
          name: err.code
        };
        if (details) response.details = err.details;
        res.status(400).json(response);
        if (nextError) next(err);
      } else {
        next(err);
      }
    };
  }
}

exports.ExpressValidatorFactory = (options = {}) => new ExpressValidator(options);
