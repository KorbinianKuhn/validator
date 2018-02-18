const _ = require('lodash');
const Validator = require('./any').Validator;
const TYPES = require('./../types');
const {
  BODY_OPTIONS,
  QUERY_OPTIONS,
  URI_OPTIONS
} = require('../defaults');

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
}

exports.ExpressValidatorFactory = (options = {}) => new ExpressValidator(options);
