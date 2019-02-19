import { TYPES, URI_OPTIONS, QUERY_OPTIONS, BODY_OPTIONS } from './options';
import * as express from 'express';
import { Validator, ObjectSchema } from '../default';
import { ValidatorOptions } from './../../interfaces';
import { RequestSchemaExpress, ResponseSchemaExpress } from '.';
import { MiddlewareOptions, middleware } from './middleware';
import { ValidationError } from './../../utils';

export class ExpressValidator extends Validator {
  constructor(options: ValidatorOptions = {}) {
    super(options);
    this._types = TYPES;
  }

  Request(options: ValidatorOptions = {}): RequestSchemaExpress {
    return new RequestSchemaExpress(options, this._options);
  }

  Params(object, options: ValidatorOptions = {}): ObjectSchema {
    return new ObjectSchema(object, options, {
      ...this._options,
      ...URI_OPTIONS
    });
  }

  Query(object, options: ValidatorOptions = {}): ObjectSchema {
    return new ObjectSchema(object, options, {
      ...this._options,
      ...QUERY_OPTIONS
    });
  }

  Body(object, options: ValidatorOptions = {}): ObjectSchema {
    return new ObjectSchema(object, options, {
      ...this._options,
      ...BODY_OPTIONS
    });
  }

  Response(options: ValidatorOptions = {}): ResponseSchemaExpress {
    return new ResponseSchemaExpress(options, { ...this._options });
  }

  middleware(
    options: MiddlewareOptions = {}
  ): (err: ValidationError, req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void> {
    return middleware(this._message, options);
  }
}
