const _ = require('lodash');

module.exports = function (options) {
  let sendDetails = true;
  if (options) {
    if (_.has(options, 'sendDetails')) sendDetails = options.sendDetails;
  }
  const middleware = function (err, req, res, next) {
    if (err.name === 'ValidationError') {
      if (sendDetails) {
        res.status(400).json(err.errors);
      } else {
        res.status(400).json({
          error: 'Bad request. Invalid input parameters and/or values.'
        });
      }
    } else {
      next(err);
    }
  }

  return middleware;
}