const Validator = require('./base');
const defaults = require('./../defaults');

class AngularValidator extends Validator {
  constructor(options = {}) {
    options.type = 'angular';
    super(options);
  }
}

module.exports = AngularValidator;
