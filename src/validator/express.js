const _ = require('lodash');
const Validator = require('./any').Validator;
const TYPES = require('./../types');
const {
  BODY_OPTIONS,
  QUERY_OPTIONS,
  URI_OPTIONS
} = require('../defaults');

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
    return TYPES.Object(schema, options, _.defaults(BODY_OPTIONS, this._options, this._defaults));
  }

  middleware(options = {}) {
    const details = _.has(options, 'details') ? options.details : DEFAULTS.details;
    const message = _.has(options, 'message') ? options.message : DEFAULTS.message;
    const nextError = _.has(options, 'next') ? options.next : DEFAULTS.next;

    return (err, req, res, next) => {
      if (err.name === 'ExpressInputValidationError') {
        const response = {
          error: message
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
