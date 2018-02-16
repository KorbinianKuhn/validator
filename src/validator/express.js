const _ = require('lodash');
const Validator = require('./any').Validator;
const TYPES = require('./../types');

const REQUEST_OPTION_KEYS = ['language', 'type', 'requiredAsDefault', 'throwValidationErrors', 'parseToType'];

class ExpressValidator extends Validator {
  constructor(options) {
    options.messages = 'default';
    options.type = 'express';
    super(options);
  }

  Request(options = {}) {
    return TYPES.Request(_.defaults(options, _.pick(this._options, ...REQUEST_OPTION_KEYS)));
  }
}

exports.ExpressValidatorFactory = (options = {}) => new ExpressValidator(options);
