const _ = require('./../../utils/lodash');

const { MIDDLEWARE_OPTIONS } = require('./options');

module.exports = (options = {}) => {
  const details = _.has(options, 'details')
    ? options.details
    : MIDDLEWARE_OPTIONS.details;
  const message = _.has(options, 'message')
    ? options.message
    : MIDDLEWARE_OPTIONS.message;
  const nextError = _.has(options, 'next')
    ? options.next
    : MIDDLEWARE_OPTIONS.next;

  return (err, req, res, next) => {
    if (err.name === 'ValidationError' && err.type === 'validator') {
      const response = {
        error: true,
        message,
        name: err.code
      };
      if (details) response.details = err.details;
      res.status(400).json(response);
      if (nextError) next(err);
    } else {
      next(err);
    }
  };
};
