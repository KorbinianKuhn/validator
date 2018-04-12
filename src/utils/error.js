class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "ValidationError";
    this.type = "validator";
    if (details) {
      this.details = details;
    }
    this.code = "validation_error";
  }
}
exports.ValidationError = ValidationError;

exports.getErrorMessage = err => {
  return err instanceof Error ? err.message : err;
};
