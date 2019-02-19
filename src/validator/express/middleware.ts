import * as express from 'express';
import { MIDDLEWARE_OPTIONS } from './options';
import { ValidationError, Message, defaultToAny } from './../../utils';

export interface MiddlewareOptions {
  details?: boolean;
  next?: boolean;
}

export const middleware = (
  message: Message,
  options: MiddlewareOptions = {}
): ((
  err: ValidationError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<void>) => {
  const details = defaultToAny(options.details, MIDDLEWARE_OPTIONS.details);
  const nextError = defaultToAny(options.next, MIDDLEWARE_OPTIONS.next);

  return async (err: ValidationError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.name === 'ValidationError' && err.type === 'validator') {
      const response: any = {
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
