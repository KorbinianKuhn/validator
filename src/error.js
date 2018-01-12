class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'ExpressInputValidationError';
    this.details = details;
  }
}

module.exports = ValidationError;
