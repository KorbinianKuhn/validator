const _ = require('lodash');

const DEFAULTS = {
  details: true,
  message: 'Bad request. Invalid input parameters and/or values.',
  next: false,
}
module.exports = function (options) {
  const details = _.has(options, 'details') ? options.details : DEFAULTS.details;
  const message = _.has(options, 'message') ? options.message : DEFAULTS.message;
  const nextError = _.has(options, 'next') ? options.next : DEFAULTS.next;

  const middleware = function (err, req, res, next) {
    if (err.name === 'ExpressInputValidationError') {
      const response = {
        error: message
      };
      if (details) response.details = err.details;
      res.status(400).json(response);
      if (nextError) next(err);
    } else {
      next(err);
    }
  }

  return middleware;
}
