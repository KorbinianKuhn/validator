const should = require('should');
const middleware = require('../src/middleware');
const ValidationError = require('../src/error');

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

describe('middleware()', () => {
  it('should respond with default settings', () => {
    const err = new ValidationError('message', 'details');
    const req = {};
    const res = new Response();
    const next = () => {};

    middleware()(err, req, res, next);
    res._status.should.equal(400);
    res._json.should.have.property('error', DEFAULTS.message);
    res._json.should.have.property('details', 'details');
  });

  it('should respond with custom error message', () => {
    const err = new ValidationError('message', 'details');
    const req = {};
    const res = new Response();
    const next = () => {};

    middleware({
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

    middleware({
      details: false
    })(err, req, res, next);
    res._status.should.equal(400);
    res._json.should.not.have.property('details');
  });

  it('other error should get nexted', () => {
    const err = new Error('message');
    const req = {};
    const res = new Response();

    middleware({
      details: false
    })(err, req, res, (err2) => {
      err.should.equal(err2);
    });
  });

  it('validation err should get nexted', () => {
    const err = new ValidationError('message', 'details');
    const req = {};
    const res = new Response();

    middleware({
      next: true
    })(err, req, res, (err2) => {
      err.should.equal(err2);
    });
    res._status.should.equal(400);
    res._json.should.have.property('details');
  });
});
