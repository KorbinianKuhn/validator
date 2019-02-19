import { ValidatorOptions } from './../../../interfaces';
import { Message, defaultToAny, removeUndefinedProperties, isPlainObject, toObject } from './../../../utils';
import { ObjectSchema, AnySchema } from './../../default';
import * as express from 'express';
import { validateResponseSync, validateResponseAsync } from '..';
import { TYPES } from './../options';

export class ResponseSchemaExpress {
  public _options: ValidatorOptions;
  public _status: number;
  public _message: Message;
  public _body: ObjectSchema;
  public _description: string;

  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    this._options = { ...defaults, ...options };
    this._message = defaultToAny(options.message, defaults.message, new Message('en'));
    this._status = 200;
  }

  options(options: any = {}) {
    const settings = { status: this._status };

    if (options.validation) {
      return removeUndefinedProperties({
        ...settings,
        message: this._message,
        body: this._body
      });
    } else {
      return removeUndefinedProperties({
        ...settings,
        type: 'response',
        description: this._description
      });
    }
  }

  async validate(res: express.Response): Promise<express.Response> {
    return validateResponseAsync(res, this.options({ validation: true }));
  }

  validateSync(res: express.Response): express.Response {
    return validateResponseSync(res, this.options({ validation: true }));
  }

  status(code: number): this {
    this._status = code;
    return this;
  }

  body(schema: object | AnySchema): this {
    if (isPlainObject(schema)) {
      schema = new ObjectSchema(schema, {}, this._options);
    } else if (TYPES.indexOf(schema.constructor) === -1) {
      throw this._message.error('unknown_schema', {});
    }

    this._body = schema as ObjectSchema;
    return this;
  }

  description(text: string): this {
    this._description = text;
    return this;
  }

  toObject(options: any = {}): any {
    const object = removeUndefinedProperties({
      body: this._body ? this._body.toObject(options) : undefined
    });

    return toObject({ ...this.options(), ...object }, options);
  }
}
