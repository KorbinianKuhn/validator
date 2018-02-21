const Validator = require('./../../index').ExpressValidator;
const ValidationError = require('../../src/error');

const validator = Validator();

class Response {
  status(number) {
    this._status = number;
    return this;
  }

  json(object) {
    this._json = object;
    return object;
  }
}

const DEFAULTS = {
  sendDetails: true,
  message: 'Bad request. Invalid input parameters and/or values.',
  next: false,
};


describe('ExpressValidator()', () => {
  it('constructor()', () => {
    validator._options.type.should.equal('express');
    validator._options.messages.should.equal('default');
  });

  it('all types should be created with the validator', () => {
    validator.Any().constructor.name.should.equal('ANY');
    validator.Array().constructor.name.should.equal('ARRAY');
    validator.Boolean().constructor.name.should.equal('BOOLEAN');
    validator.Date().constructor.name.should.equal('DATE');
    validator.Enum([]).constructor.name.should.equal('ENUM');
    validator.Function(() => {}).constructor.name.should.equal('FUNCTION');
    validator.Integer().constructor.name.should.equal('INTEGER');
    validator.Number().constructor.name.should.equal('NUMBER');
    validator.Object({}).constructor.name.should.equal('OBJECT');
    validator.Regex(/A-Z/).constructor.name.should.equal('REGEX');
    validator.Request().constructor.name.should.equal('REQUEST');
    validator.Response().constructor.name.should.equal('RESPONSE');
    validator.String().constructor.name.should.equal('STRING');
  });

  describe('middleware()', () => {
    it('should respond with default settings', () => {
      const err = new ValidationError('message', 'details');
      const req = {};
      const res = new Response();
      const next = () => {};

      validator.middleware()(err, req, res, next);
      res._status.should.equal(400);
      res._json.should.have.property('error', DEFAULTS.message);
      res._json.should.have.property('details', 'details');
    });

    it('should respond with custom error message', () => {
      const err = new ValidationError('message', 'details');
      const req = {};
      const res = new Response();
      const next = () => {};

      validator.middleware({
        message: 'custom'
      })(err, req, res, next);
      res._status.should.equal(400);
      res._json.should.have.property('error', 'custom');
    });

    it('should respond without details', () => {
      const err = new ValidationError('message', 'details');
      const req = {};
      const res = new Response();
      const next = () => {};

      validator.middleware({
        details: false
      })(err, req, res, next);
      res._status.should.equal(400);
      res._json.should.not.have.property('details');
    });

    it('other error should get nexted', () => {
      const err = new Error('message');
      const req = {};
      const res = new Response();

      validator.middleware({
        details: false
      })(err, req, res, (err2) => {
        err.should.equal(err2);
      });
    });

    it('validation err should get nexted', () => {
      const err = new ValidationError('message', 'details');
      const req = {};
      const res = new Response();

      validator.middleware({
        next: true
      })(err, req, res, (err2) => {
        err.should.equal(err2);
      });
      res._status.should.equal(400);
      res._json.should.have.property('details');
    });
  });
});
