export class ValidationError extends Error {
  public type: string;
  public code: string;
  public details: any;

  constructor(message, details) {
    super(message);
    this.name = 'ValidationError';
    this.type = 'validator';
    this.code = 'validation_error';
    if (details) {
      this.details = details;
    }
  }
}

export const getErrorMessage = (err: Error | string): string => {
  return err instanceof Error ? err.message : err;
};
