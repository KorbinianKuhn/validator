import { AnySchema } from './any';
import { defaultToAny, removeUndefinedProperties, isRegExp } from '../../../utils';
import { ValidatorOptions } from '../../../interfaces';
import { validateStringAsync, validateStringSync } from '../validation/string';

export class StringSchema extends AnySchema {
  public _empty: boolean;
  public _trim: boolean;
  public _min: number;
  public _max: number;
  public _length: number;
  public _regex: {
    pattern: RegExp;
    locales: { [key: string]: string };
  };

  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);
    this._empty = defaultToAny(options.emptyStrings, defaults.emptyStrings, true);
    this._trim = defaultToAny(options.trimStrings, defaults.trimStrings, false);
    this._defaultExample = 'string';
  }

  options(options: any = {}): any {
    const settings = {
      allowed: this._allowed,
      required: this._required,
      parse: this._parse,
      only: this._only,
      not: this._not,
      trim: this._trim,
      empty: this._empty,
      min: this._min,
      max: this._max,
      length: this._length
    };
    if (options.validation) {
      return removeUndefinedProperties({
        ...settings,
        defaultValue: this._default,
        message: this._message,
        func: this._func,
        regex: this._regex,
        nullAsUndefined: this._nullAsUndefined
      });
    } else {
      return removeUndefinedProperties({
        ...settings,
        type: 'string',
        description: this._description,
        example: this.example(),
        default: this._default,
        pattern: this._regex ? this._regex.pattern : undefined
      });
    }
  }

  validate(value: any): Promise<any> | any {
    return validateStringAsync(value, this.options({ validation: true }));
  }

  validateSync(value: any): any {
    return validateStringSync(value, this.options({ validation: true }));
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

  trim(value: boolean): this {
    this._trim = value;
    return this;
  }

  regex(pattern: RegExp, locales?: { [key: string]: string }): this {
    if (!isRegExp(pattern)) {
      throw this._message.error('invalid_regular_expression');
    }
    this._regex = {
      pattern,
      locales
    };
    return this;
  }

  // TODO email
  // email({remove}) {
  //   return this;
  // }

  // TODO alphanum
  // alphanum() {
  //   return this;
  // }

  // TODO alphabetic
  // alphabetic() {
  //   return this;
  // }

  // TODO password
  // password({ numbers, specialChars }) {
  //   return this;
  // }

  // TODO uuid
  // uuid(version = "v4") {
  //   return this;
  // }

  // TODO lowercase
  // lowercase() {
  //   return this;
  // }

  // TODO uppercase
  // uppercase() {
  //   return this;
  // }

  // TODO replace
  // replace() {
  //   return this;
  // }

  // TODO words
  // words() {
  //   return this;
  // }

  // TODO split
  // split() {
  //   return this;
  // }

  // TODO deburr
  // deburr() {
  //   return this;
  // }

  // TODO escape
  // escape() {
  //   return this;
  // }

  // TODO mongoDbId
  // mongoDbId() {
  //   return this;
  // }

  // TODO uri
  // uri() {
  //   return this;
  // }

  // TODO hex
  // hex() {
  //   return this;
  // }
}
