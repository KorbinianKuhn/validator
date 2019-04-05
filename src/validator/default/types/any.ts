import { ValidatorOptions } from '../../../interfaces';
import {
  Message,
  toObject,
  cloneSchema,
  defaultToAny,
  isArray,
  isFunction,
  removeUndefinedProperties
} from '../../../utils';
import { validateAnySync, validateAnyAsync } from '../validation/any';

export class AnySchema {
  public _message: Message;
  public _required: boolean;
  public _parse: boolean;
  public _nullAsUndefined: boolean;
  public _description: string;
  public _example: any;
  public _default: any;
  public _only: any[];
  public _not: any[];
  public _allowed: any[];
  public _func: Function;

  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    this._message = defaultToAny(options.message, defaults.message, new Message('en'));
    this._required = defaultToAny(options.requiredAsDefault, defaults.requiredAsDefault, false);
    this._parse = defaultToAny(options.parseToType, defaults.parseToType, false);
    this._nullAsUndefined = defaultToAny(options.nullAsUndefined, defaults.nullAsUndefined, false);
  }

  options(options: any = {}) {
    const settings = {
      allowed: this._allowed,
      required: this._required,
      parse: this._parse,
      only: this._only,
      not: this._not
    };
    if (options.validation) {
      return removeUndefinedProperties({
        ...settings,
        defaultValue: this._default,
        message: this._message,
        func: this._func,
        nullAsUndefined: this._nullAsUndefined
      });
    } else {
      return removeUndefinedProperties({
        ...settings,
        type: 'any',
        description: this._description,
        example: this.example(),
        default: this._default
      });
    }
  }

  validate(value: any): Promise<any> | any {
    return validateAnyAsync(value, this.options({ validation: true }));
  }

  validateSync(value: any): any {
    return validateAnySync(value, this.options({ validation: true }));
  }

  required(): this {
    this._required = true;
    return this;
  }

  optional(): this {
    this._required = false;
    return this;
  }

  description(description: string): this {
    this._description = description;
    return this;
  }

  example(example?: any): this {
    if (example === undefined) {
      return this._example;
    } else {
      this._example = example;
      return this;
    }
  }

  default(value: any): this {
    this._default = value;
    return this;
  }

  parse(value: boolean): this {
    this._parse = value;
    return this;
  }

  only(...values: any): this {
    this._only = isArray(values[0]) ? values[0] : values;
    return this;
  }

  not(...values: any): this {
    this._not = isArray(values[0]) ? values[0] : values;
    return this;
  }

  allow(...values: any): this {
    this._allowed = isArray(values[0]) ? values[0] : values;
    return this;
  }

  func(func: Function): this {
    if (!isFunction(func)) {
      throw this._message.error('invalid_function', {});
    }
    this._func = func;
    return this;
  }

  toObject(options = {}): any {
    return toObject(this.options(), options);
  }

  clone(): this {
    return cloneSchema(this);
  }
}
