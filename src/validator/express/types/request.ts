import { ValidatorOptions } from './../../../interfaces';
import { Message, isPlainObject, defaultToAny, removeUndefinedProperties, toObject } from './../../../utils';
import { ObjectSchema, ArraySchema } from './../../default';
import { URI_OPTIONS, QUERY_OPTIONS, BODY_OPTIONS } from '../options';
import * as express from 'express';
import { validateRequestSync, validateRequestAsync } from '..';

export const toSchema = (schema, options, defaults, message, allowArray = false): ObjectSchema | ArraySchema => {
  switch (schema.constructor) {
    case ObjectSchema:
      break;
    case ArraySchema: {
      if (!allowArray) {
        throw message.error('invalid_schema', {});
      }
      break;
    }
    default: {
      if (isPlainObject(schema)) {
        schema = new ObjectSchema(schema, options, defaults);
      } else {
        throw message.error('express_object_or_array_schema', {});
      }
    }
  }

  return schema;
};

export class RequestSchemaExpress {
  public _options: ValidatorOptions;
  public _message: Message;
  public _unknown: boolean;
  public _params: ObjectSchema;
  public _query: ObjectSchema;
  public _body: ObjectSchema | ArraySchema;
  public _description: string;

  constructor(options: ValidatorOptions, defaults: ValidatorOptions) {
    this._options = { ...defaults, ...options };
    this._message = defaultToAny(options.message, defaults.message, new Message('en'));
    this._unknown = defaultToAny(options.unknownObjectKeys, defaults.unknownObjectKeys, true);
  }

  options(options: any = {}): any {
    const settings = {
      unknown: this._unknown
    };

    if (options.validation) {
      return removeUndefinedProperties({
        ...settings,
        message: this._message,
        params: this._params,
        query: this._query,
        body: this._body
      });
    } else {
      return removeUndefinedProperties({
        ...settings,
        type: 'request',
        description: this._description
      });
    }
  }

  async validate(req: express.Request): Promise<express.Request> {
    return validateRequestAsync(req, this.options({ validation: true }));
  }

  validateSync(req: express.Request): express.Request {
    return validateRequestSync(req, this.options({ validation: true }));
  }

  description(description): this {
    this._description = description;
    return this;
  }

  params(schema: ObjectSchema | object, options: ValidatorOptions = {}): this {
    this._params = toSchema(
      schema,
      options,
      { ...this._options, ...URI_OPTIONS },
      this._message,
      false
    ) as ObjectSchema;
    return this;
  }

  query(schema: ObjectSchema | object, options: ValidatorOptions = {}): this {
    this._query = toSchema(
      schema,
      options,
      { ...this._options, ...QUERY_OPTIONS },
      this._message,
      false
    ) as ObjectSchema;
    return this;
  }

  body(schema: ObjectSchema | ArraySchema | object, options: ValidatorOptions = {}): this {
    this._body = toSchema(schema, options, { ...this._options, ...BODY_OPTIONS }, this._message, true);
    return this;
  }

  toObject(options: any = {}): any {
    const object = removeUndefinedProperties({
      params: this._params ? this._params.toObject(options) : undefined,
      query: this._query ? this._query.toObject(options) : undefined,
      body: this._body ? this._body.toObject(options) : undefined
    });
    return toObject({ ...this.options(), ...object }, options);
  }
}
