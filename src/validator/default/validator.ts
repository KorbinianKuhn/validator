import { ValidatorOptions } from '../../interfaces/validator-options.interface';
import { AnySchema } from './types/any';
import { Message } from '../../utils/message';
import { VALIDATOR_OPTIONS, TYPES } from './options';
import { defaultToAny, has } from './../../utils/lodash';
import { ValidationError } from './../../utils/error';
import { BooleanSchema } from './types/boolean';
import { StringSchema } from './types/string';
import { NumberSchema } from './types/number';
import { DateSchema } from './types/date';
import { ArraySchema } from './types/array';
import { ObjectSchema } from './types/object';
import { Locale } from './../../interfaces/locale.interface';

export class Validator {
  public _options: ValidatorOptions;
  public _customs: any;
  public _types: any[];
  public _message: Message;

  constructor(options: ValidatorOptions = {}) {
    // TODO make this work for extended classes
    if (!(this instanceof Validator)) {
      return new Validator(options);
    }

    this._options = { ...VALIDATOR_OPTIONS, ...options };
    this._customs = {};
    this._types = TYPES;
    this._message = new Message(defaultToAny(this._options.locale, 'en'));
    this._options.message = this._message;
  }

  async validate(schema: AnySchema, data: any): Promise<any> {
    if (this._types.indexOf(schema.constructor) === -1) {
      throw this._message.error('unknown_schema');
    }

    try {
      return await schema.validate(data);
    } catch (err) {
      const error = new ValidationError(this._message.get('validation_error'), err);
      if (this._options.throwValidationErrors) {
        throw error;
      } else {
        return error;
      }
    }
  }

  validateSync(schema: AnySchema, data: any): any {
    if (this._types.indexOf(schema.constructor) === -1) {
      throw this._message.error('unknown_schema');
    }

    try {
      return schema.validateSync(data);
    } catch (err) {
      const error = new ValidationError(this._message.get('validation_error'), err);
      if (this._options.throwValidationErrors) {
        throw error;
      } else {
        return error;
      }
    }
  }

  addLocale(name: string, messages: Locale): this {
    this._message.addLocale(name, messages);
    return this;
  }

  setLocale(name: string): this {
    this._message.setLocale(name);
    return this;
  }

  addType(name: string, schema: AnySchema): this {
    if (name in this._customs) {
      throw this._message.error('duplicate_custom_type', { name });
    }

    // if (this._types.indexOf(schema.constructor) === -1) {
    //   throw this._message.error('invalid_custom_type', {
    //     name,
    //     type: schema.constructor.name
    //   });
    // }

    this._customs[name] = schema.clone();

    return this;
  }

  Custom(name: string): any {
    if (name in this._customs) {
      return this._customs[name].clone();
    } else {
      throw this._message.error('unknown_custom_type', { name });
    }
  }

  listCustomTypes(): string[] {
    return Object.keys(this._customs).map(key => `${key}: ${this._customs[key].constructor}`);
  }

  Any(options: ValidatorOptions = {}): AnySchema {
    return new AnySchema(options, this._options);
  }

  Array(schema?: AnySchema, options: ValidatorOptions = {}): ArraySchema {
    return new ArraySchema(schema, options, this._options);
  }

  Boolean(options: ValidatorOptions = {}): BooleanSchema {
    return new BooleanSchema(options, this._options);
  }

  Date(options: ValidatorOptions = {}): DateSchema {
    return new DateSchema(options, this._options);
  }

  Number(options: ValidatorOptions = {}): NumberSchema {
    return new NumberSchema(options, this._options);
  }

  Object(schema: object = {}, options: ValidatorOptions = {}): ObjectSchema {
    return new ObjectSchema(schema, options, this._options);
  }

  String(options: ValidatorOptions = {}): StringSchema {
    return new StringSchema(options, this._options);
  }
}
