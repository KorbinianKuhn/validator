const validators = require('./src/validator');

exports.Validator = validators.Validator;
exports.AngularValidator = validators.AngularValidator;
exports.ExpressValidator = validators.ExpressValidator;
exports.ValidationError = require('./src/error');
