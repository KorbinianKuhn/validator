const should = require('should');
const ValidationError = require('../index').ValidationError;

describe('ValidationError()', () => {
  it('should have no message and details', () => {
    const error = new ValidationError();
    should.equal(error.name, 'ValidationError');
    should.equal(error.type, 'validator');
    should.equal(error.code, 'validation_error');
    should.equal(error.message, '');
    should.equal(error.details, undefined);
  });

  it('should have custom message and details', () => {
    const error = new ValidationError('message', 'details');
    should.equal(error.name, 'ValidationError');
    should.equal(error.type, 'validator');
    should.equal(error.code, 'validation_error');
    should.equal(error.message, 'message');
    should.equal(error.details, 'details');
  });
});
