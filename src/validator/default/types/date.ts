import { toDate, defaultToAny, removeUndefinedProperties } from '../../../utils';
import { AnySchema } from './any';
import { ValidatorOptions } from '../../../interfaces';
import { validateDateAsync, validateDateSync } from '../validation/date';

export class DateSchema extends AnySchema {
  public _utc: boolean;
  public _min: string;
  public _max: string;

  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);
    this._utc = defaultToAny(options.utc, defaults.utc, false);
  }

  options(options: any = {}) {
    const settings = {
      allowed: this._allowed,
      required: this._required,
      parse: this._parse,
      utc: this._utc,
      only: this._only,
      not: this._not
    };
    if (options.validation) {
      return removeUndefinedProperties({
        ...settings,
        defaultValue: this._default,
        message: this._message,
        func: this._func,
        min: this._min,
        max: this._max,
        nullAsUndefined: this._nullAsUndefined
      });
    } else {
      return removeUndefinedProperties({
        ...settings,
        type: 'date',
        description: this._description,
        example: this.example(),
        default: this._default,
        min: this._min ? this._min : undefined,
        max: this._max ? this._max : undefined
      });
    }
  }

  validate(value: any): Promise<any> | any {
    return validateDateAsync(value, this.options({ validation: true }));
  }

  validateSync(value: any): any {
    return validateDateSync(value, this.options({ validation: true }));
  }

  utc(value: boolean): this {
    this._utc = value;
    return this;
  }

  min(value: Date | number | string): this {
    this._min = toDate(this._message, value, this._utc).toISOString();
    return this;
  }

  max(value: Date | number | string): this {
    this._max = toDate(this._message, value, this._utc).toISOString();
    return this;
  }

  // TODO unix
  // unix() {
  //   return this;
  // }
}
