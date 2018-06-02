const middleware = require('./../../../src/validator/express/middleware');
const { Message } = require('./../../../src/utils/message');
const { ValidationError } = require('./../../../src/utils/error');
const { Response } = require('./../../helper');

describe('middleware()', () => {
  const message = Message();
  test('should respond with default settings', () => {
    const err = new ValidationError('message', 'details');
    const req = {};
    const res = new Response();
    const next = () => {};

    middleware(message)(err, req, res, next);
    expect(res._status).toBe(400);
    expect(res._json).toHaveProperty(
      'message',
      'Invalid input parameters and/or values.'
    );
    expect(res._json).toHaveProperty('details', 'details');
  });

  test('should respond without details', () => {
    const err = new ValidationError('message', 'details');
    const req = {};
    const res = new Response();
    const next = () => {};

    middleware(message, {
      details: false
    })(err, req, res, next);
    expect(res._status).toBe(400);
    expect(res._json).not.toHaveProperty('details');
  });

  test('other error should get nexted', () => {
    const err = new Error('message');
    const req = {};
    const res = new Response();

    middleware(message, {
      details: false
    })(err, req, res, err2 => {
      expect(err).toBe(err2);
    });
  });

  test('validation err should get nexted', () => {
    const err = new ValidationError('message', 'details');
    const req = {};
    const res = new Response();

    middleware(message, {
      next: true
    })(err, req, res, err2 => {
      expect(err).toBe(err2);
    });
    expect(res._status).toBe(400);
    expect(res._json).toHaveProperty('details');
  });
});
