import { AnySchema } from './any';
import { ValidatorOptions } from '../../../interfaces';
import { removeUndefinedProperties } from '../../../utils';
import { validateNumberAsync, validateNumberSync } from '../validation/number';

export class NumberSchema extends AnySchema {
  public _integer: boolean;
  public _min: number;
  public _max: number;
  public _less: number;
  public _greater: number;
  public _positive: boolean;
  public _negative: boolean;

  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);
    this._integer = false;
  }

  options(options: any = {}) {
    const settings = {
      allowed: this._allowed,
      required: this._required,
      parse: this._parse,
      only: this._only,
      not: this._not,
      min: this._min,
      max: this._max,
      less: this._less,
      greater: this._greater,
      positive: this._positive,
      negative: this._negative,
      integer: this._integer
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
        type: 'number',
        description: this._description,
        example: this.example(),
        default: this._default
      });
    }
  }

  validate(value: any): Promise<any> | any {
    return validateNumberAsync(value, this.options({ validation: true }));
  }

  validateSync(value: any): any {
    return validateNumberSync(value, this.options({ validation: true }));
  }

  integer(): this {
    this._integer = true;
    return this;
  }

  min(number: number): this {
    this._min = number;
    return this;
  }

  max(number: number): this {
    this._max = number;
    return this;
  }

  less(number: number): this {
    this._less = number;
    return this;
  }

  greater(number: number): this {
    this._greater = number;
    return this;
  }

  positive(): this {
    this._positive = true;
    return this;
  }

  negative(): this {
    this._negative = true;
    return this;
  }

  // TODO round
  // round(precision = 2) {
  //   return this;
  // }

  // TODO ceil
  // ceil(precision = 2) {
  //   return this;
  // }

  // TODO floor
  // floor(precision = 2) {
  //   return this;
  // }
}
