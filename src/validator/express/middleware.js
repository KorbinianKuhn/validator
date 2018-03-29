const _ = require("./../../utils/lodash");

const DEFAULTS = {
  details: true,
  message: "Bad request. Invalid input parameters and/or values.",
  next: false
};

module.exports = (options = {}) => {
  const details = _.has(options, "details")
    ? options.details
    : DEFAULTS.details;
  const message = _.has(options, "message")
    ? options.message
    : DEFAULTS.message;
  const nextError = _.has(options, "next") ? options.next : DEFAULTS.next;

  return (err, req, res, next) => {
    if (err.name === "ValidationError" && err.type === "validator") {
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
