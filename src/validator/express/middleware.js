const { defaultTo } = require('./../../utils/lodash');

const { MIDDLEWARE_OPTIONS } = require('./options');

module.exports = (message, options = {}) => {
  const details = defaultTo(options.details, MIDDLEWARE_OPTIONS.details);
  const nextError = defaultTo(options.next, MIDDLEWARE_OPTIONS.next);

  return (err, req, res, next) => {
    if (err.name === 'ValidationError' && err.type === 'validator') {
      const response = {
        error: true,
        message: message.get('validation_error'),
        name: err.code
      };
      if (details) {
        response.details = err.details;
      }
      res.status(400).json(response);
      if (nextError) {
        next(err);
      }
    } else {
      next(err);
    }
  };
};
