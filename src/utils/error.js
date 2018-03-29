class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "ValidationError";
    this.type = "validator";
    this.details = details;
    this.code = "validation_error";
  }
}

exports.ValidationError = ValidationError;
