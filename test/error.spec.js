const assert = require('assert');
const should = require('should');
const ValidationError = require('../src/error');

describe('ValidationError()', function () {
  it('should have no message and details', () => {
    const error = new ValidationError();
    should.equal(error.name, 'ExpressInputValidationError');
    should.equal(error.message, '');
    should.equal(error.details, undefined);
  });

  it('should have custom message and details', () => {
    const error = new ValidationError('message', 'details');
    should.equal(error.name, 'ExpressInputValidationError');
    should.equal(error.message, 'message');
    should.equal(error.details, 'details');
  });
});
