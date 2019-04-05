import { AnySchema } from './any';
import { ValidatorOptions } from '../../../interfaces';
import { toObject, defaultToAny, removeUndefinedProperties } from '../../../utils';
import { validateArrayAsync, validateArraySync } from '../validation/array';

export class ArraySchema extends AnySchema {
  public _type: AnySchema;
  public _empty: boolean;
  public _unique: boolean;
  public _min: number;
  public _max: number;
  public _length: number;

  constructor(schema?: AnySchema, options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);
    this._type = schema;
    this._empty = defaultToAny(options.emptyArrays, defaults.emptyArrays, true);
  }

  options(options: any = {}) {
    const settings = {
      allowed: this._allowed,
      required: this._required,
      parse: this._parse,
      unique: this._unique,
      empty: this._empty,
      min: this._min,
      max: this._max,
      length: this._length,
      only: this._only,
      not: this._not
    };
    if (options.validation) {
      return removeUndefinedProperties({
        ...settings,
        defaultValue: this._default,
        message: this._message,
        itemSchema: this._type,
        func: this._func,
        nullAsUndefined: this._nullAsUndefined
      });
    } else {
      return removeUndefinedProperties({
        ...settings,
        type: 'array',
        description: this._description,
        example: this.example(),
        default: this._default
      });
    }
  }

  validate(value: any): Promise<any> | any {
    return validateArrayAsync(value, this.options({ validation: true }));
  }

  validateSync(value: any): any {
    return validateArraySync(value, this.options({ validation: true }));
  }

  example(example?: any): any {
    if (example === undefined) {
      return this._example === undefined
        ? this._type === undefined
          ? undefined
          : [this._type.example()]
        : this._example;
    } else {
      this._example = example;
      return this;
    }
  }

  min(length: number): this {
    this._min = length;
    return this;
  }

  max(length: number): this {
    this._max = length;
    return this;
  }

  length(length: number): this {
    this._length = length;
    return this;
  }

  empty(value: boolean): this {
    this._empty = value;
    return this;
  }

  unique(value: boolean): this {
    this._unique = value;
    return this;
  }

  toObject(options: any = {}): any {
    const items = this._type ? this._type.toObject(options) : undefined;
    return toObject({ ...this.options(), items }, options);
  }

  // TODO compact
  // compact() {
  //   return this;
  // }

  // TODO remove
  // remove() {
  //   return this;
  // }

  // TODO reverse
  // reverse() {
  //   return this;
  // }

  // TODO sort
  // sort() {
  //   return this;
  // }

  // TODO removeDuplicates
  // removeDuplicates() {
  //   return this;
  // }

  // TODO join
  // join() {
  //   return this;
  // }

  // TODO filter
  // filter() {
  //   return this;
  // }
}
