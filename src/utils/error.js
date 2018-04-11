class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'ValidationError';
    this.type = 'validator';
    if (details) {
      this.details = details;
    }
    this.code = 'validation_error';
  }
}
exports.ValidationError = ValidationError;

class ValueError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
  }
}
exports.ValueError = ValueError;

exports.toError = err => {
  return err instanceof Error ? err : new Error(err);
};
