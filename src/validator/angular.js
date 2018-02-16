const Validator = require('./any').Validator;
const defaults = require('./../defaults');

class AngularValidator extends Validator {
  constructor(options) {
    options.messages = 'default';
    options.type = 'angular';
    super(options);
  }
}

exports.AngularValidatorFactory = (options = {}) => new AngularValidator(options);
