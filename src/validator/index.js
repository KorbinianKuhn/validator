const Validator = require('./base');
const AngularValidator = require('./angular');

function ValidatorFactory(options) {
  return new Validator(options);
}

exports.Validator = ValidatorFactory;

function AngularValidatorFactory(options) {
  return new AngularValidator(options);
}

exports.AngularValidator = AngularValidatorFactory;
